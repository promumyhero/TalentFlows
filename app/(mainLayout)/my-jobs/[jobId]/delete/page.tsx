import { deleteJobPost } from "@/app/action";
import { requireUser } from "@/app/utils/requireUser";
import { SubmitButton } from "@/components/general/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

type Params = Promise<{ jobId: string }>;

export default async function DeleteJobPage({ params }: { params: Params }) {
  const { jobId } = await params;
  const session = await requireUser();
  return (
    <div>
      <Card className="max-w-lg mx-auto mt-28">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this job?</CardTitle>
          <CardDescription>This action cannot be undone</CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <Link
            href={"/my-jobs"}
            className={buttonVariants({ variant: "secondary" })}
          >
            <ArrowLeftIcon />
            Cancel
          </Link>
          <form
            action={async () => {
              "use server";

              await deleteJobPost(jobId);
            }}
          >
            <SubmitButton
              text="Delete"
              variant="destructive"
              icon={<Trash2Icon />}
            />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
