import { savedJobPost, unSavedJobPost } from "@/app/action";
import arcjet, { detectBot, tokenBucket } from "@/app/utils/arcjet";
import { auth } from "@/app/utils/auth";
import { getFlagEmoji } from "@/app/utils/countriesList";
import { prisma } from "@/app/utils/db";
import { benefits } from "@/app/utils/listOfBenefits";
import { JsonToHtml } from "@/components/general/JsonToHtml";
import { SavedJobButton } from "@/components/general/SubmitButton";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { request } from "@arcjet/next";
import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
);

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    );
  } else {
    return aj.withRule(
      tokenBucket({
        mode: "DRY_RUN",
        capacity: 100,
        interval: 60,
        refillRate: 10,
      })
    );
  }
}

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob] = await Promise.all([
    await prisma.postJob.findUnique({
      where: {
        status: "ACTIVE",
        id: jobId,
      },
      select: {
        jobTitle: true,
        jobDescription: true,
        location: true,
        employementType: true,
        benefits: true,
        createdAt: true,
        listingDuration: true,
        Company: {
          select: {
            name: true,
            about: true,
            location: true,
            logo: true,
          },
        },
      },
    }),
    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobPostId: {
              userId,
              jobPostId: jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ]);

  if (!jobData) {
    return notFound();
  }
  return {
    jobData,
    savedJob,
  };
}
type Params = Promise<{ jobId: string }>;

export default async function JobIdPage({ params }: { params: Params }) {
  const { jobId } = await params;

  {
    /* arcjet */
  }
  const session = await auth();
  const req = await request();
  const decision = await getClient(!session).protect(req, { requested: 10 });
  if (decision.isDenied()) {
    throw new Error("forbidden");
  }

  {
    /* arcjet */
  }

  const { jobData: data, savedJob } = await getJob(jobId, session?.user?.id);
  const locationFlag = getFlagEmoji(data.location);
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="space-y-8 col-span-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Marketing Manager</h1>
            <div className="flex items-center gap-2 mt-2">
              <p>{data.jobTitle}</p>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full" variant={"secondary"}>
                {data.employementType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">*</span>
              <Badge className="rounded-full">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                {data.location}
              </Badge>
            </div>
          </div>
          {session?.user ? (
            <form
              action={
                savedJob
                  ? unSavedJobPost.bind(null, savedJob.id)
                  : savedJobPost.bind(null, jobId)
              }
            >
              <SavedJobButton savedJob={!!savedJob} />
            </form>
          ) : (
            <Link
              href={"/login"}
              className={buttonVariants({ variant: "outline" })}
            >
              <HeartIcon className="size-4" />
              Save Job
            </Link>
          )}
        </div>
        {/* Description */}
        <section>
          <JsonToHtml json={JSON.parse(data.jobDescription)} />
        </section>
        <section>
          <h3 className="font-semibold mb-4">
            Benefit{" "}
            <span className="text-sm text-muted-foreground font-normal">
              (Green indicates benefit is offered)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {benefits.map((benefit) => {
              const isOffered = data.benefits.includes(benefit.id);
              return (
                <Badge
                  key={benefit.id}
                  variant={isOffered ? "default" : "outline"}
                  className={cn(
                    isOffered ? "" : "opacity-75 cursor-not-allowed",
                    "text-sm px-4 py-1.5 rounded-full"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {benefit.icon}
                    {benefit.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </section>
      </div>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Apply for this job</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Please let {data.Company?.name} know you are interested.
              </p>
            </div>
            <Button className="w-full">Apply Now</Button>
          </div>
        </Card>
        {/* Job Details Card */}
        <Card className="p-6">
          <h3 className="font-semibold">Job Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Apply before
              </span>
              <span className="text-sm">
                {new Date(
                  data.createdAt.getTime() +
                    data.listingDuration * 24 * 60 * 60 * 1000
                ).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Posted on</span>
              <span className="text-sm">
                {data.createdAt.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Employement Type
              </span>
              <span className="text-sm">{data.employementType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{data.location}</span>
            </div>
          </div>
        </Card>
        {/* Company Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={data.Company?.logo || ""}
                alt="company logo"
                width={48}
                height={48}
                className="rounded-full size-12"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold">{data.Company?.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {data.Company?.about}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
