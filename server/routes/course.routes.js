import express from "express";
import {
  getCourses,
  getSpecificCourse,
} from "../controllers/course.controller.js";

export const courseRouter = express.Router();

courseRouter.get("/", getCourses);
courseRouter.get("/:id", getSpecificCourse);
