"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function createCompany(data: z.infer<typeof companySchema>) {
  const session = await requireUser();

  const validatedData = companySchema.parse(data);

  await prisma.user.update({
    where: {
      id: session?.id,
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
