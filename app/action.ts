"use server";

import { z } from "zod";
import { requireUser } from "./utils/requireUser";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { request } from "@arcjet/next";
import { stripe } from "./utils/stripe";
import { jobListingDurationPricing } from "./utils/jobListingDurationPricing";

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

/**
 * Membuat data lowongan kerja
 * @param {z.infer<typeof jobSchema>} data data yang akan diinputkan
 * @returns {Promise<Response>} balikan response redirect ke halaman utama
 * @throws {Error} apabila data tidak valid atau user tidak memiliki perusahaan
 */
export async function createJob(data: z.infer<typeof jobSchema>) {
  const user = await requireUser();

  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSchema.parse(data);
  const company = await prisma.company.findUnique({
    where: {
      userId: user.id as string,
    },
    select: {
      id: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  if (!company?.id) {
    return redirect("/");
  }

  let stripeCustomerId = company.user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email as string,
      name: user.name as string,
    });

    stripeCustomerId = customer.id;

    // update user with stripe customer id
    await prisma.user.update({
      where: {
        id: user.id as string,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  await prisma.postJob.create({
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employementType: validatedData.employementType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
      companyId: company.id,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration");
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          product_data: {
            name: `Job Posting - ${pricingTier.days} Days`,
            description: pricingTier.description,
            images: [
              "https://lrtfo6geun.ufs.sh/f/SWGYUyKAeJKZ8uyROmC8Pu4O2wVvFG1jSR3LYpMUohqdgIym",
            ],
          },
          currency: "IDR",
          unit_amount: pricingTier.price * 100, //TODO : nanti ini bisa diubah dan menyesuaikan apakah benar implementasi untuk idr begini
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}
