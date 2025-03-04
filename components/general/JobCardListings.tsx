import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";
import { JobStatus } from "@prisma/client";

async function getData({
  page = 1,
  pageSize = 4,
  jobTypes = [],
  location = "",
}: {
  page: number;
  pageSize: number;
  jobTypes: string[];
  location: string;
}) {
  const skip = (page - 1) * pageSize;
  const where = {
    status: JobStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employementType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
  };
  const [data, totalCount] = await Promise.all([
    prisma.postJob.findMany({
      where: where,

      take: pageSize,
      skip: skip,

      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employementType: true,
        location: true,
        createdAt: true,
        Company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.postJob.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);
  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function JobCardListings({
  currentPage,
  jobTypes,
  location,
}: {
  currentPage: number;
  jobTypes: string[];
  location: string;
}) {
  const { jobs, totalPages } = await getData({
    page: currentPage,
    pageSize: 4,
    jobTypes: jobTypes,
    location: location,
  });
  return (
    <>
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Active Job Listings"
          description=" Try searching for a different job or location"
          buttonText="Clear Filters"
          href="/"
        />
      )}
      <div className="flex justify-center m-6">
        <MainPagination totalPage={totalPages} currentPage={currentPage} />
      </div>
    </>
  );
}
