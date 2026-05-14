import express from "express";
import { catchError } from "../utils/catchError.js";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../utils/ErrorMessage.js";
import { v2 as cloudinary } from "cloudinary";
import CourseModel from "../models/Course.js";
import PurchaseModel from "../models/Purchase.js";
import UserModel from "../models/User.js";

export const updateToEducatorRole = catchError(async (req, res, next) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return next(new AppError("User not found", 404));
  }

  await clerkClient.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "educator",
    },
  });

  return res.json({ success: true, message: "You can publish a course now" });
});

export const addCourse = catchError(async (req, res, next) => {
  const { courseData } = req.body;
  const imageFile = req.file;
  const { userId } = getAuth(req);
  const educatorId = userId;

  if (!imageFile) {
    return res.json({ success: false, message: "Thumbnail Not Attached" });
  }

  const parsedCourseData = JSON.parse(courseData);
  parsedCourseData.educator = educatorId;
  const imageUpload = await cloudinary.uploader.upload(imageFile.path);
  parsedCourseData.courseThumbnail = imageUpload.secure_url;
  const newCourse = await CourseModel.create(parsedCourseData);

  await newCourse.save();

  return res.json({ success: true, message: "Course Added Successfully" });
});

export const getEducatorCourses = catchError(async (req, res, next) => {
  const educator = getAuth(req).userId;
  const courses = await CourseModel.find({ educator });
  res.status(200).json({ success: true, courses });
});

export const educatorDashboardData = catchError(async (req, res, next) => {
  const educator = getAuth(req).userId;
  const courses = await CourseModel.find({ educator });
  const totalCourses = courses.length;
  const coursesId = courses.map((course) => course._id);

  const purchases = await PurchaseModel.find({
    courseId: { $in: coursesId },
    status: "completed",
  });

  const totalEarnings = purchases.reduce(
    (sum, purchase) => sum + purchase.amount,
    0,
  );

  const enrolledStudentsData = [];
  for (const course of courses) {
    const students = await UserModel.find(
      {
        _id: { $in: course.enrolledStudents },
      },
      "name imageUrl",
    );

    students.forEach((student) => {
      enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
    });

    return res.status(200).json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourses },
    });
  }
});

export const studentEnrolledData = catchError(async (req, res, next) => {
  const educator = getAuth(req).userId;
  const courses = await CourseModel.find({ educator });
  const coursesId = courses.map((course) => course._id);

  const purchases = await PurchaseModel.find({
    courseId: { $in: coursesId },
    status: "completed",
  })
    .populate("userId", "name imageUrl")
    .populate("courseId", "courseTitle");

  const enrolledStudents = purchases.map((purchase) => ({
    student: purchase.userId,
    courseTitle: purchase.courseId.courseTitle,
    purchaseDate: purchase.createdAt,
  }));

  return res.status(200).json({ success: true, enrolledStudents });
});
