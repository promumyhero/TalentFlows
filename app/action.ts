"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await requireUser();

  const validatedData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      onBoardingComplete: true,
      userType: "company",
      Company: {
        create: {
          ...validatedData,
        },
      },
    },
  });
  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user?.id as string,
    },
    data: {
      onBoardingComplete: true,
      userType: "jobSeeker",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}
