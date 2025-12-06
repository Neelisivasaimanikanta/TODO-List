import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// ✅ IMPORT ROUTES
import authRoutes from "./routes/authRoutes.js";
// later you can add: import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// ✅ MIDDLEWARES (ORDER MATTERS)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
// app.use("/api/tasks", taskRoutes); // later

// ✅ BASE ROUTE
app.get("/", (req, res) => {
  res.send("Task App API is running ✅");
});

console.log("Server file executed ✅");

// ✅ DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB error ❌", err.message);
  });
