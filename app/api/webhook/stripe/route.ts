import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

/**
 * Handle Stripe webhook event. This function is called by Stripe
 * to notify us of events related to payment such as payment success
 * or payment failure.
 *
 * @param {Request} req - The request object
 * @returns {Response} - The response object
 */
export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    return new Response("Invalid signature", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer as string;
    const jobId = session.metadata?.jobId as string;

    if (!jobId) {
      console.log("No job ID found in metadata");
      return new Response("Invalid job ID", { status: 400 });
    }

    const company = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId as string,
      },
      select: {
        Company: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!company) {
      return new Response("Invalid company", { status: 400 });
    }

    await prisma.postJob.update({
      where: {
        id: jobId,
        companyId: company?.Company?.id as string,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }

  return new Response(null, { status: 200 });
}
