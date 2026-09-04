import mongoose from "mongoose";
import { DBname } from "./constants.js";
const connectDB = async () => {
  try {
     await mongoose.connect(`${process.env.MONGODB_URI}/${DBname}`);
  } catch (error) {
    console.log("Error while connection to MongoDB !", error);
    process.exit(1);
  }
};
export default connectDB;
