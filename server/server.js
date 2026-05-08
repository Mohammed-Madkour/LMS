import express from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./configs/dbConnection.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((error, req, res, next) => {
  res.status(400).json({
    success: false,
    message: error.message,
    statusCode: error.statusCode || 400,
  });
});

// connect database
dbConnection();

// Routes
app.get("/", (req, res) => res.send("Api Working"));
app.post("/clerk", clerkWebhooks);

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
