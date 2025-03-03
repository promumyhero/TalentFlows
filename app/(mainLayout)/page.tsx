import { JobCardListings } from "@/components/general/JobCardListings";
import { JobFilters } from "@/components/general/JobFilters";
import { JobListingLoading } from "@/components/general/JobListingLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading />} key={currentPage}>
          <JobCardListings currentPage={currentPage} />
        </Suspense>
      </div>
    </div>
  );
}
