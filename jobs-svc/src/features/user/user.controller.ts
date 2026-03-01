import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import httpStatus from "http-status";

// getMe API: fetch user by id from token
const getMe = catchAsync(async (req, res) => {
  const userId = req?.user?.id;
  const user = await userService.getMe(userId as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully!",
    data: user,
  });
});
 

export const userController = {
  getMe
};
