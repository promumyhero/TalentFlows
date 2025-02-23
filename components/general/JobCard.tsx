import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { MapPlusIcon, User2Icon } from "lucide-react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/app/utils/formatCurrency";

interface JobCardProps {
  job: {
    id: string;
    createdAt: Date;
    Company: {
      about: string;
      name: string;
      location: string;
      logo: string;
    } | null;
    jobTitle: string;
    employementType: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/job`}>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <Image
              src={job.Company?.logo || ""}
              alt={job.Company?.name || "Company Logo"}
              width={48}
              height={48}
              className="size-12 rounded-lg"
            />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{job.jobTitle}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {job.Company?.name}
                </p>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="rounded-full" variant={"secondary"}>
                  {job.employementType}
                </Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <Badge className="rounded-full">{job.location}</Badge>
                <span className="hidden md:inline text-muted-foreground">
                  *
                </span>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(job.salaryFrom)} -{" "}
                  {formatCurrency(job.salaryTo)}
                </p>
              </div>
            </div>
            <div className="nd:ml-auto">
              <div className="flex items-center gap-2">
                <MapPlusIcon className="size-4" />
                <h1>{job.location}</h1>
              </div>
              <p>{job.createdAt.toString()}</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
