import mongoose from "mongoose";
// import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectResponse = await mongoose.connect(
      `${process.env.DB_URL}/indus`,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("CONNECTION SUCCESS: ", connectResponse.connection.host)
  } catch (error) {
    console.error("ERROR TO CONNECT DB: ", error);
    process.exit(1)
  }
};

export default connectDB;

