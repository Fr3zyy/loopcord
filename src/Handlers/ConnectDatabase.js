import mongoose from "mongoose";

export async function ConnectDatabase(uri, options = {}) {
  try {
    await mongoose.connect(uri, options);

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection lost.");
    });

    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}