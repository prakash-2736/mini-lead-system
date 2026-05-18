import mongoose, { Mongoose } from "mongoose";

// Allow using a local MongoDB instance by default for development.
// Prefer an explicit MONGODB_URI from environment when provided.
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mini-lead-system";

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "mini-lead-system",
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
