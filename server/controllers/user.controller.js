import express from "express";
import { catchError } from "../utils/catchError.js";
import { AppError } from "../utils/ErrorMessage.js";
import { getAuth } from "@clerk/express";
import UserModel from "../models/User.js";
import CourseModel from "../models/Course.js";
import PurchaseModel from "../models/Purchase.js";
import Stripe from "stripe";
import CourseProgessModel from "../models/CourseProgress.js";

export const getUserData = catchError(async (req, res, next) => {
  const userId = getAuth(req).userId;
  const user = await UserModel.findById(userId);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }
  return res.status(200).json({ success: true, user });
});

export const userEnrolledCourses = catchError(async (req, res, next) => {
  const userId = getAuth(req).userId;
  const userData = await UserModel.findById(userId).populate("enrolledCourses");

  return res
    .status(200)
    .json({ success: true, enrolledCourses: userData.enrolledCourses });
});

export const purchaseCourse = catchError(async (req, res, next) => {
  const { courseId } = req.body;
  const { origin } = req.headers;
  const userId = getAuth(req).userId;
  const userData = await UserModel.findById(userId);
  const courseData = await CourseModel.findById(courseId);

  if (!userData || !courseData) {
    return next(new AppError("Data not found", 404));
  }

  const purchaseData = {
    courseId: courseData._id,
    userId,
    amount: (
      (courseData.coursePrice * (100 - courseData.discount)) /
      100
    ).toFixed(2),
  };

  const newPurchase = await PurchaseModel.create(purchaseData);

  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const currency = process.env.CURRENCY.toLowerCase();

  const line_items = [
    {
      price_data: {
        currency,
        product_data: {
          name: courseData.courseTitle,
        },
        unit_amount: Math.floor(newPurchase.amount) * 100,
      },
      quantity: 1,
    },
  ];

  const session = await stripeInstance.checkout.sessions.create({
    line_items: line_items,
    success_url: `${origin}/loading/my-enrollments`,
    cancel_url: `${origin}/`,
    mode: "payment",
    metadata: {
      purchaseId: newPurchase._id.toString(),
    },
  });

  return res.status(200).json({ success: true, session_url: session.url });
});

export const updateUserCourseProgress = catchError(async (req, res, next) => {
  const userId = getAuth(req).userId;
  const { courseId, lectureId } = req.body;
  const progressData = await CourseProgessModel.findOne({ userId, courseId });

  if (progressData) {
    if (progressData.lectureCompleted.includes(lectureId)) {
      return res
        .status(200)
        .json({ success: true, message: "Lecture Already Completed" });
    }
    progressData.lectureCompleted.push(lectureId);
    await progressData.save();
  } else {
    await CourseProgessModel.create({
      userId,
      courseId,
      lectureCompleted: [lectureId],
    });
  }

  return res.status(200).json({ success: true, message: "Progress Updated" });
});

export const getUserCourseProgress = catchError(async (req, res, next) => {
  const userId = getAuth(req).userId;
  const { courseId, lectureId } = req.body;
  const progressData = await CourseProgessModel.findOne({ userId, courseId });

  return res.status(200).json({ success: true, progressData });
});

export const addUserRating = catchError(async (req, res, next) => {
  const userId = getAuth(req).userId;
  const { courseId, rating } = req.body;

  if (rating < 1 || rating > 5 || !userId || !courseId) {
    return next(new AppError("Invalid Details", 400));
  }

  const course = await CourseModel.findById(courseId);
  if (!course) {
    return next(new AppError("Course Not Found", 404));
  }

  const user = await UserModel.findById(userId);
  if (!user || !user.enrolledCourses.includes(courseId)) {
    return next(new AppError("User didn't purchase this course", 400));
  }

  const exisitingRatingIndex = course.courseRatings.findIndex(
    (r) => r.userId === userId,
  );

  if (exisitingRatingIndex > -1) {
    course.courseRatings[exisitingRatingIndex].rating = rating;
  } else {
    course.courseRatings.push({ userId, rating });
  }

  await course.save();

  return res.status(200).json({ success: true, message: "Rating added" });
});
