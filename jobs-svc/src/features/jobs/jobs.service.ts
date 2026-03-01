import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { badRequest, notFound } from "../../utils/errorfunc";
import { CreateJobInput } from "./jobs.schemas";

const createJob = async (data: CreateJobInput) => {
  if (!data.tenantId) {
    throw badRequest("tenantId is required");
  }

  let tenant;
  try {
    tenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
      select: { id: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw badRequest("Invalid tenantId format. tenantId must be a valid UUID");
    }
    throw error;
  }

  if (!tenant) {
    throw notFound("Tenant not found");
  }

  const job = await prisma.job.create({
    data: {
      tenantId: data.tenantId,
      title: data.title,
      department: data.department,
      location: data.location,
      employmentType: data.employmentType,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      description: data.description,
      status: data.status ?? "draft",
    },
  });

  return job;
};

export const jobsService = {
  createJob,
};
