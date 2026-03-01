
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  SignupInput,
  LoginInput,
  VerifyEmailInput, 
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schemas";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../utils/email";
import { conflict, notFound } from "../../utils/errorfunc";
import { generateToken } from "../../utils/generateToken";
import { UpdatePasswordInput } from "./auth.schemas";

const prisma = new PrismaClient();
const EMAIL_SECRET = process.env.EMAIL_SECRET || "email_secret";
const RESET_SECRET = process.env.RESET_SECRET || "reset_secret";

// create user logic
const createUser = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) throw conflict("User already registered");

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const tenant = await prisma.tenant.create({
    data: {
      name: data.tenantName,
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Create User
  const user = await prisma.user.create({
    data: {
      id: data._id,
      name: data.name,
      tenant: {
        connect: { id: tenant.id },
      },
      email: data.email,
      password: hashedPassword,
      role: Role.USER, 
      status: data.status,
    },
  });

  const verificationToken = jwt.sign({ userId: user.id }, EMAIL_SECRET, {
    expiresIn: "10m",
  });
  const isSendMain = await sendVerificationEmail(user.email, verificationToken);

  if (isSendMain) {
    return {
      _id: user.id,
      name: data.name,
      tenantId: tenant.id,
      tenantName: tenant.name,
      role: user.role,
      email: user.email,
      
      status: (user as any).status,
      verificationToken
    };
  } else {
    throw conflict("Something was wrong!");
  }
};

// user login logic
const login = async (data: LoginInput) => {
  // Get full user data for password comparison
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
    },
  });

  if (!user) {
    throw notFound("User not found!");
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    throw notFound("Invalid email or password");
  }

  const tokenBody = {
    userId: user.id,
    email: user.email,
    role: user.role,
    id: user.id,
  };

  const path = (user.role as string).toLowerCase().replace(/_/g, "-");
  // Generate JWT
  const token = generateToken(tokenBody, "7d");

  return {
    token,
    path,
    role: user.role as string,
  };
};

// verify email logic
const verifyEmail = async (data: VerifyEmailInput) => {
  const decoded = jwt.verify(data.token, EMAIL_SECRET);
  const userId = (decoded as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound("User not found");

  await prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
  return;
};
 
// forgot password logic
const forgotPassword = async (data: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    throw notFound("User not found");
  }
  const token = generateToken({ id: user.id }, "10m");

  await sendPasswordResetEmail(user.email, token);
  return {
    success: true,
    message:
      "If that email is registered, a password reset link has been sent.",
  };
};

// reset password logic
const resetPassword = async (data: ResetPasswordInput) => {
  const decoded = jwt.verify(data.token, RESET_SECRET);
  const userId = (decoded as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw notFound("User not found");
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return;
};
 
const updatePassword = async (data: UpdatePasswordInput) => {
  const decoded = jwt.decode(data.token) as { userId: string };
  
  const user = await prisma.user.findUnique({ where: { id: decoded?.userId } });
  
  
  if (!user) throw notFound("User not found");

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  await prisma.user.update({
    where: { id: decoded?.userId },
    data: { password: hashedPassword },
  });
  return { success: true, message: "Password updated successfully!" };
};

// resend verification email logic
const resendVerificationEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw notFound("User not found");
  if (user.emailVerified) throw conflict("Email already verified");
  const verificationToken = jwt.sign({ userId: user.id }, EMAIL_SECRET, {
    expiresIn: "10m",
  });
  const isSendMain = await sendVerificationEmail(user.email, verificationToken);
  if (isSendMain) {
    return { token: verificationToken, email: user.email };
  } else {
    throw conflict("Failed to send verification email");
  }
};
export const authService = {
  createUser,
  login,
  verifyEmail, 
  forgotPassword,
  resetPassword, 
  updatePassword,
  resendVerificationEmail,
};
