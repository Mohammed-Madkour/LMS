import express from "express";
import {
  addUserRating,
  getUserCourseProgress,
  getUserData,
  purchaseCourse,
  updateUserCourseProgress,
  userEnrolledCourses,
} from "../controllers/user.controller.js";

export const userRouter = express.Router();

userRouter.get("/", getUserData);
userRouter.get("/courses", userEnrolledCourses);
userRouter.post("/purchase", purchaseCourse);
userRouter.post("update-user-course-progress", updateUserCourseProgress);
userRouter.get("get-user-course-progress", getUserCourseProgress);
userRouter.post("add-rating", addUserRating);
