import express from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./configs/dbConnection.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

app.use(cors());

// Clerk webhook MUST come BEFORE json middleware
app.post("/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("Api Working"));

// connect database
dbConnection();

// error handler LAST
app.use((error, req, res, next) => {
  res.status(400).json({
    success: false,
    message: error.message,
    statusCode: error.statusCode || 400,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
