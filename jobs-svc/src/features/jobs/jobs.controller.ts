import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createJobSchema } from "./jobs.schemas";
import { jobsService } from "./jobs.service";

const getParamValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
};

const createJob = catchAsync(async (req, res) => {
  const tenantId = req.user?.tenantId;
  const payload = createJobSchema.parse({ ...req.body, tenantId });
  const result = await jobsService.createJob(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getAllJobsByTenantId = catchAsync(async (req, res) => {
  const tenantId = getParamValue(req.user?.tenantId);
  const result = await jobsService.getAllJobsByTenantId(tenantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Jobs fetched successfully",
    data: result,
  });
});

const getSingleJobByIdAndTenantId = catchAsync(async (req, res) => {
  const tenantId = getParamValue(req.user?.tenantId);
  const id = getParamValue(req.params.id);
  const result = await jobsService.getSingleJobByIdAndTenantId(id, tenantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job fetched successfully",
    data: result,
  });
});

const deleteJobByIdAndTenantId = catchAsync(async (req, res) => {
  const tenantId = getParamValue(req.user?.tenantId);
  const id = getParamValue(req.params.id);
  await jobsService.deleteJobByIdAndTenantId(id, tenantId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Job deleted successfully",
    data: null,
  });
});

export const jobsController = {
  createJob,
  getAllJobsByTenantId,
  getSingleJobByIdAndTenantId,
  deleteJobByIdAndTenantId,
};
