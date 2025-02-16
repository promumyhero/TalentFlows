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

const company = [
  { id: 0, name: "Arcjet", logo: ArcjetLogo },
  { id: 1, name: "Inngest", logo: InngestLogo },
  { id: 2, name: "Arcjet", logo: ArcjetLogo },
  { id: 3, name: "Inngest", logo: InngestLogo },
  { id: 4, name: "Arcjet", logo: ArcjetLogo },
  { id: 5, name: "Inngest", logo: InngestLogo },
];

export default function PostJobPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Post Job</CardTitle>
        </CardHeader>
      </Card>
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Trusted Job Seekers</CardTitle>
            <CardDescription>Join our trusted job seekers.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
