import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  studentEnrolledData,
  updateToEducatorRole,
} from "../controllers/educator.controller.js";
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

export const educatorRouter = express.Router();

educatorRouter.get("/update-role", updateToEducatorRole);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse,
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get("/enrolled-students", protectEducator, studentEnrolledData);
