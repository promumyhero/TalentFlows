import { requireUser } from "@/app/utils/requireUser";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCheckIcon } from "lucide-react";
import Link from "next/link";

/**
 * Halaman ini akan di render ketika user melakukan pembayaran dengan sukses
 * dan akan di redirect ke halaman ini
 *
 * @returns {JSX.Element}
 */
export default async function PaymentSuccess() {
  await requireUser();
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <CheckCheckIcon className="size-12 p-2 bg-green-500/30 text-green-500 rounded-full" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">Payment Successful</h2>
            <p className="text-muted-foreground text-sm mt-2 tracking-tight text-balance">
              Your payment has been successfully processed
            </p>
            <Button className="w-full mt-5" asChild>
              <Link href={"/"}>Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
