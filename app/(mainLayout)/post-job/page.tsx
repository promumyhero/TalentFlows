import { prisma } from "@/app/utils/db";
import { requireUser } from "@/app/utils/requireUser";
import { CreateJobForm } from "@/components/forms/CreateJobForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ArcjetLogo from "@/public/arcjet.jpg";
import InngestLogo from "@/public/inngest-locale.png";
import Image from "next/image";
import { redirect } from "next/navigation";

const company = [
  { id: 0, name: "Arcjet", logo: ArcjetLogo },
  { id: 1, name: "Inngest", logo: InngestLogo },
  { id: 2, name: "Arcjet", logo: ArcjetLogo },
  { id: 3, name: "Inngest", logo: InngestLogo },
  { id: 4, name: "Arcjet", logo: ArcjetLogo },
  { id: 5, name: "Inngest", logo: InngestLogo },
];

const testimonial = [
  {
    id: 0,
    quote: "Connecting top talent with the right opportunities—effortlessly.",
    author: "John Doe",
    company: "Arcjet",
  },
  {
    id: 1,
    quote: "Your next career move or top hire starts here.",
    author: "John Doe",
    company: "Arcjet",
  },
  {
    id: 2,
    quote:
      "Empowering companies and job seekers with seamless hiring solutions.",
    author: "John Doe",
    company: "Arcjet",
  },
];

const stats = [
  { id: 0, value: "50,000+", label: "Monthly active job seekers" },
  { id: 1, value: "10,000+", label: "Companies hiring on TalentFlows" },
  { id: 2, value: "95%", label: "Candidate satisfaction rate" },
  { id: 3, value: "200,000+", label: "Total job applications submitted" },
  { id: 4, value: "5 minutes", label: "Average time to apply for a job" },
  { id: 5, value: "80%", label: "Faster hiring process with our AI tools" },
];

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId: userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  });
  if (!data) {
    return redirect("/");
  }
  return data;
}

export default async function PostJobPage() {
  const session = await requireUser();
  const data = await getCompany(session.id as string);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <CreateJobForm
        companyAbout={data.about}
        companyLocation={data.location}
        companyName={data.name}
        companyLogo={data.logo}
        companyWebsite={data.website}
        companyXAccount={data.xAccount}
      />
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Trusted Job Seekers</CardTitle>
            <CardDescription>Join our trusted job seekers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logo */}

            <div className="grid grid-cols-3 gap-4">
              {company.map((company) => (
                <div key={company.id}>
                  <Image
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={80}
                    className="rounded-lg opacity-75 transition-opacity hover:opacity-100"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              {testimonial.map((testimonial) => (
                <blockquote
                  key={testimonial.id}
                  className="border-l-2 border-primary pl-4"
                >
                  <p className="text-sm text-muted-foreground italic">
                    
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <footer className="mt-2 text-sm font-medium">
                    - {testimonial.author}, {testimonial.company}
                  </footer>
                </blockquote>
              ))}
            </div>
            {/* we will render stats here */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stats) => (
                <div key={stats.id} className="rounded-lg bg-muted p-4">
                  <h4 className="text-2xl font-bold">{stats.value}</h4>
                  <p className="text-sm text-muted-foreground">{stats.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
