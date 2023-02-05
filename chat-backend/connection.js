import mongoose from "mongoose";

mongoose.set("strictQuery", true);
const connectDB = async (url) => {
  mongoose.connect(url, () => {
    console.log("conected to mongodb");
  });
};
export default connectDB;
