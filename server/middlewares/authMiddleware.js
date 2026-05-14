import { clerkClient, getAuth } from "@clerk/express";
import { catchError } from "../utils/catchError.js";
import { AppError } from "../utils/ErrorMessage.js";

export const protectEducator = catchError(async (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return next(new AppError("Authentication required", 400));
  }

  const user = await clerkClient.users.getUser(userId);

  if (user.publicMetadata.role !== "educator") {
    return next(new AppError("Unauthorized acesss", 400));
  }

  next();
});
