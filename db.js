import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

let client;
let db;

export async function connectDB() {
  try {
    if (db) return db;
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("MongoDB connected:", dbName);
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("DB not connected. Call connectDB() first.");
  return db;
}
