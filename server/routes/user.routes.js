import express from "express";
import {
  getUserData,
  purchaseCourse,
  userEnrolledCourses,
} from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/", getUserData);
userRouter.get("/courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
