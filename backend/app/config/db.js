import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const con = await mongoose.connect(process.env.MONG_URI);
    console.log("Database connected sucessfully!!");
  } catch (error) {
    console.log(error);
  }
};

export { connectDb };

