import { JobCardListings } from "@/components/general/JobCardListings";
import { JobFilters } from "@/components/general/JobFilters";
import { JobListingLoading } from "@/components/general/JobListingLoading";
import { Suspense } from "react";

type SearchParams = {
  searchParams: Promise<{
    page?: string;
    jobTypes?: string;
    location?: string;
  }>;
};


/**
 * Komponen halaman utama yang menampilkan daftar lowongan pekerjaan sesuai filter.
 *
 * Komponen ini menerima parameter `searchParams` yang berisi parameter query string
 * berupa `page`, `jobTypes`, dan `location`. Parameter `page` berisi nomor halaman
 * yang akan ditampilkan, parameter `jobTypes` berisi jenis pekerjaan yang akan
 * ditampilkan, dan parameter `location` berisi lokasi pekerjaan yang akan ditampilkan.
 *
 * Komponen ini akan menampilkan daftar lowongan pekerjaan sesuai filter yang diberikan
 * dan akan membuat unique key untuk komponen berdasarkan filter yang diberikan.
 *
 * @param {{ searchParams: { page?: string, jobTypes?: string, location?: string } }} props
 * @returns {JSX.Element}
 */
export default async function Home({ searchParams }: SearchParams) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const jobTypes = params.jobTypes?.split(",") || [];
  const location = params.location || "";

  // create a unique key for the component
  const filterKey = `page=${currentPage};types=${jobTypes.join(
    ","
  )};location=${location}`;
  return (
    <div className="grid grid-cols-3 gap-8">
      <JobFilters />
      <div className="col-span-2 flex flex-col gap-6">
        <Suspense fallback={<JobListingLoading />} key={filterKey}>
          <JobCardListings
            currentPage={currentPage}
            jobTypes={jobTypes}
            location={location}
          />
        </Suspense>
      </div>
    </div>
  );
}
