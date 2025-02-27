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
import { inngest } from "./utils/inngest/client";
import { revalidatePath } from "next/cache";

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

  const postJob = await prisma.postJob.create({
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
    select: {
      id: true,
    },
  });

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  );

  if (!pricingTier) {
    throw new Error("Invalid listing duration");
  }

  await inngest.send({
    name: "job/created",
    data: {
      jobId: postJob.id,
      expirationDays: validatedData.listingDuration,
    },
  });

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
    metadata: {
      jobId: postJob.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
  });

  return redirect(session.url as string);
}


/**
 * Menyimpan job posting yang di-save oleh user
 * @param {string} jobId id dari job posting yang akan di-save
 * @throws {Error} apabila user tidak memiliki akses
 */
export async function savedJobPost(jobId: string) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  await prisma.savedJobPost.create({
    data: {
      jobPostId: jobId,
      userId: user.id as string,
    },
  });
  revalidatePath(`/job/${jobId}`);
}


/**
 * Menghapus saved job post dari user yang sedang login.
 *
 * @param {string} savedJobPostId - ID dari saved job post yang ingin dihapus.
 *
 * @throws {Error} - Jika user tidak memiliki akses atau tidak login.
 *
 * @return {Promise<void>}
 */
export async function unSavedJobPost(savedJobPostId: string) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: user.id as string,
    },
    select: {
      jobPostId: true,
    },
  });
  revalidatePath(`/job/${data.jobPostId}`);
}

/**
 * Edit a job post
 * @param {z.infer<typeof jobSchema>} data data yang akan diinputkan
 * @param {string} jobId id dari job post yang akan diedit
 * @returns {Promise<void>}
 * @throws {Error} apabila user tidak memiliki perusahaan yang sesuai atau data tidak valid
 */
export async function editJobPost(
  data: z.infer<typeof jobSchema>,
  jobId: string
) {
  const user = await requireUser();
  const req = await request();
  const decision = await aj.protect(req);
  const validatedData = jobSchema.parse(data);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }
  await prisma.postJob.update({
    where: {
      id: jobId,
      Company: {
        userId: user.id as string,
      },
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employementType: validatedData.employementType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      benefits: validatedData.benefits,
    },
  });
  return redirect("/my-jobs");
}


/**
 * Delete a job post
 * @param {string} jobId id dari job post yang akan dihapus
 * @returns {Promise<Response>} balikan response redirect ke halaman utama
 * @throws {Error} apabila user tidak memiliki perusahaan yang sesuai atau request tidak valid
 */
export async function deleteJobPost(jobId: string) {
  const session = await requireUser();
  const req = await request();

  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  await prisma.postJob.delete({
    where: {
      id: jobId,
      Company: {
        userId: session.id as string,
      },
    },
  });
  await inngest.send({
    name: "job/cancel.expiration",
    data: { jobId: jobId },
  });
  return redirect("/my-jobs");
}
