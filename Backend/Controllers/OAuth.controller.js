import { OAuthToken } from "../MongoDB/Models/OAuthToken.schema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { google } from 'googleapis';
import jwt from "jsonwebtoken";

const oauth2client = new google.auth.OAuth2(
     process.env.GOOGLE_CLIENT_ID,
     process.env.GOOGLE_CLIENT_SECRET,
     process.env.GOOGLE_REDIRECT_URI,
     )
const connect = AsyncHandler(async (req,res) => {
    const userId = req.user._id
    const state = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{ expiresIn: "10m" })
    const authUrl = oauth2client.generateAuthUrl({access_type:"offline",
        scope:"https://www.googleapis.com/auth/youtube.readonly",
        state: state,
        prompt: "consent"
    })
    res.redirect(authUrl)
})
const callback = AsyncHandler(async (req, res) => {
  try {
  
    const { code, state } = req.query
 
    const decoded = jwt.verify(state, process.env.ACCESS_TOKEN_SECRET)
    const userId = decoded.userId
 
    const { tokens } = await oauth2client.getToken(code)
    await OAuthToken.findOneAndUpdate(
      { userId, platform: "youtube" },
      {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date),
        scope: tokens.scope || "youtube.readonly"
      },
      { upsert: true }
    )

    res.redirect(`${process.env.FRONTEND_URL}/import?connected=true`)

  } catch (error) {

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.redirect(`${process.env.FRONTEND_URL}/import?error=invalid_state`)
    }


    if (error.code >= 400) {
      return res.redirect(`${process.env.FRONTEND_URL}/import?error=oauth_failed`)
    }

    console.error('OAuth callback error:', error)
    res.redirect(`${process.env.FRONTEND_URL}/import?error=callback_failed`)
  }
})

const status = AsyncHandler(async(req,res)=>{
const findOAuthtoken = await OAuthToken.findOne({ userId: req.user._id,platform: "youtube" })
if(findOAuthtoken){
   res.status(200).json( {connected:true,expiresAt:findOAuthtoken.expiresAt})
}
else{
    res.status(200).json({connected: false})
}
})
const revoke = AsyncHandler(async (req, res) => {
  const userId = req.user._id

  const deletedToken = await OAuthToken.findOneAndDelete({
    userId,
    platform: "youtube"
  })

  if (!deletedToken) {
    throw new ApiError(404, "No YouTube connection found to revoke")
  }

  res.status(200).json(
    new ApiResponse(200, {}, "YouTube connection revoked successfully")
  )
})

export {connect,callback,status,revoke}