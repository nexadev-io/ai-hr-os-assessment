import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { badRequest, notFound } from "../../utils/errorfunc";
import { CreateJobInput } from "./jobs.schemas";

const createJob = async (data: CreateJobInput) => {
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
      status: data.status,
    },
  });

  return job;
};

const getAllJobsByTenantId = async (tenantId: string) => {
  if (!tenantId) {
    throw badRequest("tenantId is required");
  }

  try {
    const jobs = await prisma.job.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    return jobs;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw badRequest("Invalid tenantId format. tenantId must be a valid UUID");
    }
    throw error;
  }
};

const getSingleJobByIdAndTenantId = async (id: string, tenantId: string) => {
  if (!id) {
    throw badRequest("id is required");
  }
  if (!tenantId) {
    throw badRequest("tenantId is required");
  }

  try {
    const job = await prisma.job.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!job) {
      throw notFound("Job not found");
    }

    return job;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw badRequest("Invalid id or tenantId format. Both must be valid UUIDs");
    }
    throw error;
  }
};

const deleteJobByIdAndTenantId = async (id: string, tenantId: string) => {
  const job = await getSingleJobByIdAndTenantId(id, tenantId);

  await prisma.job.delete({
    where: {
      id: job.id,
    },
  });

  return null;
};

export const jobsService = {
  createJob,
  getAllJobsByTenantId,
  getSingleJobByIdAndTenantId,
  deleteJobByIdAndTenantId,
};
