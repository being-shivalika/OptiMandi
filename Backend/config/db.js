import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI", process.env.MONGO_URI); 

    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB connected");
  } catch (err) {
    console.log("DB error:", err.message);
    process.exit(1);
  }
};

export default connectDB;