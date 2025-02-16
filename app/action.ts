"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

/**
 * Membuat data perusahaan
 * @param {z.infer<typeof companySchema>} data data yang akan diinputkan
 * @returns {Promise<Response>} balikan response redirect ke halaman utama
 * @throws {Error} apabila data tidak valid
 */
export async function createCompany(data: z.infer<typeof companySchema>) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

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

/**
 * Membuat data job seeker
 * @param {z.infer<typeof jobSeekerSchema>} data data yang akan diinputkan
 * @returns {Promise<Response>} balikan response redirect ke halaman utama
 * @throws {Error} apabila data tidak valid
 */
export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

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
