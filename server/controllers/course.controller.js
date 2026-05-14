import express from "express";
import { catchError } from "../utils/catchError.js";
import { AppError } from "../utils/ErrorMessage.js";
import CourseModel from "../models/Course.js";

export const getCourses = catchError(async (req, res, next) => {
  const courses = await CourseModel.find({})
    .select(["-courseContent", "-enrolledStudents"])
    .populate("educator");

  res.status(200).json({ success: true, courses });
});

export const getSpecificCourse = catchError(async (req, res, next) => {
  const { id } = req.params;
  const course = await CourseModel.findById(id).populate("educator");

  course.courseContent.map((chapter) =>
    chapter.chapterContent.map((lecture) =>
      lecture.isPreviewFree ? lecture.lectureUrl : (lecture.lectureUrl = ""),
    ),
  );
  res.status(200).json({ success: true, course });
});
