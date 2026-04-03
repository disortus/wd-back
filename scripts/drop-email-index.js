import mongoose from "mongoose";

await mongoose.connect("mongodb://localhost:27017/rplc");
console.log("Connected to MongoDB");

const col = mongoose.connection.collection("users");

try {
  await col.dropIndex("email_1");
  console.log("Index 'email_1' dropped successfully");
} catch (e) {
  console.log("Index not found or error:", e.message);
}

await mongoose.disconnect();
console.log("Disconnected");