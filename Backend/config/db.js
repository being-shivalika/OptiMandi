import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/optimandi";
    
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI is missing from environment variables. Falling back to local database.");
    }

    await mongoose.connect(uri);

    console.log("DB connected successfully");
  } catch (err) {
    console.error("DB connection error:", err.message);
    console.error("Please ensure MongoDB is running and MONGO_URI is correct.");
    // We don't use process.exit(1) so the app can still start and show friendly API errors.
  }
};

export default connectDB;