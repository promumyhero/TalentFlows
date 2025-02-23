import Link from "next/link";
import { Card, CardHeader } from "../ui/card";

export function JobCard() {
  return (
    <Link href={`/job`}>
      <Card>
        <CardHeader>
          
        </CardHeader>
      </Card>
    </Link>
  )
}