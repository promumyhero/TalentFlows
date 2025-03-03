import { prisma } from "@/app/utils/db";
import { EmptyState } from "./EmptyState";
import { JobCard } from "./JobCard";
import { MainPagination } from "./MainPagination";

async function getData(page: number = 1, pageSize: number = 2) {
  const skip = (page - 1) * pageSize;
  const [data, totalCount] = await Promise.all([
    prisma.postJob.findMany({
      where: {
        status: "ACTIVE",
      },

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
}: {
  currentPage: number;
}) {
  const { jobs, totalPages } = await getData(currentPage);
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
