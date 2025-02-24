import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { EmptyState } from "@/components/general/EmptyState";
import { JobCard } from "@/components/general/JobCard";

async function getSavedJobs(userId: string) {
  const data = await prisma.savedJobPost.findMany({
    where: {
      userId: userId,
    },
    select: {
      PostJob: {
        select: {
          id: true,
          jobTitle: true,
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
      },
    },
  });
  return data;
}

export default async function SavedJobs() {
  const session = await requireUser();
  const data = await getSavedJobs(session?.id as string);

  if (data.length === 0) {
    return (
      <EmptyState
        title="No saved jobs"
        description="You have not saved any jobs yet."
        buttonText="Find a job"
        href="/"
      />
    );
  }
  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {data.map((saved) => (
        <JobCard key={saved.PostJob.id} job={saved.PostJob} />
      ))}
    </div>
  );
}
