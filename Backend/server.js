import dotenv from "dotenv";
import connectDB from "./MongoDB/Connection.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Connection successfull");
    app.listen(port, () => {
      console.log(`The BMS app is listening on http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("fix ConnnectDB");
  });
