import express from "express";
import cors from "cors";
import "dotenv/config";
import { dbConnection } from "./configs/dbConnection.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import { updateToEducatorRole } from "./controllers/educator.controller.js";
import { connectCloudinary } from "./configs/cloudinary.js";
import { educatorRouter } from "./routes/educator.routes.js";
import { courseRouter } from "./routes/course.routes.js";
import { userRouter } from "./routes/user.routes.js";

const app = express();

// connect database
dbConnection();
await connectCloudinary();

// Middlewares
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => res.send("Api Working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/courses", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.use("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use((error, req, res, next) => {
  return res.status(400).json({
    success: false,
    message: error.message,
    statusCode: error.statusCode || 400,
  });
});

const PORT = process.env.port || 5000;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
