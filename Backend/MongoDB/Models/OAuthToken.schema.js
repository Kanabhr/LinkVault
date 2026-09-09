import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const OAuthTokenSchema = new mongoose.Schema({

userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
platform:{ 
    type: String, 
    enum: ["youtube"], 
    required: true 
},
accessToken:{ 
    type: String, required: true 
},
refreshToken:{ 
    type: String, required: true 
},
expiresAt:{ 
    type: Date, required: true 
},
scope: {
    type: String
}
}
)
OAuthTokenSchema.index({ userId: 1, platform: 1 }, { unique: true })
export const OAuthToken = mongoose.model("OAuthToken",OAuthTokenSchema)
