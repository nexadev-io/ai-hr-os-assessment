
import { Router } from "express";
import { authControls } from "./auth.controller";
import authentication from "../../middleware/authentication";

const router = Router();
 


/**
 * Handles the creation of a new user.
 *
 * @route POST /auth/create-user
 * @param req - Express request object containing user registration data in the body.
 * @param res - Express response object used to send the result of the user creation process.
 * @returns Returns a success response with the created user data or an error response if creation fails.
 */

router.post("/create-user",  authControls.createUser);

/**
 * Test endpoint to check if API is working
 *
 * @route GET /auth/test
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns Returns a simple success response.
 */
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working!",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Handles user login.
 *
 * @route POST /auth/login
 * @param req - Express request object containing user login credentials in the body.
 * @param res - Express response object used to send the authentication result.
 * @returns Returns a success response with authentication data or an error response if login fails.
 */
router.post("/login",authentication(), authControls.login);

/**
 * Handles email verification.
 *
 * @route POST /auth/verify-email
 * @param req - Express request object containing verification token in the body.
 * @param res - Express response object used to send the verification result.
 * @returns Returns a success response if email is verified or an error response if verification fails.
 */
router.post("/verify-email",  authControls.verifyEmail);
 
/**
 * Handles forgot password request.
 *
 * @route POST /auth/forgot-password
 * @param req - Express request object containing email in the body.
 * @param res - Express response object used to send the password reset result.
 * @returns Returns a success response with reset instructions or an error response if request fails.
 */
router.post("/forgot-password", authControls.forgotPassword);

router.post("/reset-password", authControls.resetPassword);

/**
 * Handles password update for logged-in users.
 *
 * @route POST /auth/update-password
 * @param req - Express request object containing oldPassword and newPassword in the body.
 * @param res - Express response object used to send the result.
 * @returns Returns a success response if password is updated or an error response if update fails.
 */
router.post("/update-password", authControls.updatePassword);




// ...existing code...

/**
 * Handles resending verification email.
 *
 * @route POST /auth/resend-verification-email
 * @param req - Express request object containing email in the body.
 * @param res - Express response object used to send the result.
 * @returns Returns a success response if email is resent or an error response if fails.
 */
router.post("/resend-verification-email", authControls.resendVerificationEmail);


export const authRoute = router;
