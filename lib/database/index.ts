import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, prom: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!URI) throw new Error("URI is missing");

  cached.prom =
    cached.prom ||
    mongoose.connect(URI, { dbName: "summit-spot", bufferCommands: false });

  cached.conn = await cached.prom;

  return cached.conn;
};
