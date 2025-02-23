import { JobCardListings } from "@/components/general/JobCardListings";
import { JobFilters } from "@/components/general/JobFilters";

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <JobCardListings />
      </div>
    </div>
  );
}
