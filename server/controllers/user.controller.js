import express from "express";
import { catchError } from "../utils/catchError.js";
import { AppError } from "../utils/ErrorMessage.js";
import { getAuth } from "@clerk/express";
import UserModel from "../models/User.js";
import CourseModel from "../models/Course.js";
import PurchaseModel from "../models/Purchase.js";
import Stripe from "stripe";

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


