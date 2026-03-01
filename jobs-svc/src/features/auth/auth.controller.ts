import httpStatus from "http-status";

import {
  signupSchema,
  loginSchema,
  verifyEmailSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import { authService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


// create user controls handle errors
const createUser = catchAsync(async (req, res) => {
  
  const data = signupSchema.parse(req.body);
  const user = await authService.createUser(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Create user successfully!",
    data: user,
  });
});

// user login controls handle errors
const login = catchAsync(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const user = await authService.login(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully login!",
    data: user,
  });
});

// verify email controls handle errors
const verifyEmail = catchAsync(async (req, res) => {
  const data = verifyEmailSchema.parse(req.body);
  const result = await authService.verifyEmail(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully!",
    data: result,
  });
});
 
// forgot password controls handle errors
const forgotPassword = catchAsync(async (req, res) => {
  const data = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset link sent successfully!",
    data: result,
  });
});

// reset password controls handle errors
const resetPassword = catchAsync(async (req, res) => {
  const data = resetPasswordSchema.parse(req.body);
  const result = await authService.resetPassword(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully!",
    data: result,
  });
});
// update password controls handle errors
const updatePassword = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await authService.updatePassword(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password updated successfully!",
    data: result,
  });
});

// resend verification email controller
const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await authService.resendVerificationEmail(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verification email resent successfully!",
    data: result,
  });
});

export const authControls = {
  createUser,
  login,
  verifyEmail, 
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  updatePassword,
};
