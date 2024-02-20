import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!URI) throw new Error("URI is missing");

  cached.promise =
    cached.promise ||
    mongoose.connect(URI, { dbName: "Summit Spot", bufferCommands: false });

  cached.conn = await cached.promise;

  return cached.conn;
};
