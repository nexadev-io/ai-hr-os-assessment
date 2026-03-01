import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createJobSchema } from "./jobs.schemas";
import { jobsService } from "./jobs.service";

const createJob = catchAsync(async (req, res) => {
  const tenantId = req.user?.tenantId;
  console.log(tenantId);
  const payload = createJobSchema.parse({ ...req.body, tenantId });
  const result = await jobsService.createJob(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

export const jobsController = {
  createJob,
};
