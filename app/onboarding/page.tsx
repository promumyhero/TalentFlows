import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { requireUser } from "../utils/requireUser";
import { prisma } from "../utils/db";
import { redirect } from "next/navigation";

/**
 * Memeriksa apakah pengguna dengan id tertentu telah menyelesaikan proses onboarding
 * Jika ya, maka akan diarahkan ke halaman utama
 * Jika tidak, maka akan mengembalikan data pengguna
 * @param {string} userId id pengguna yang ingin diperiksa
 * @returns {Promise<User | Response>} data pengguna jika belum selesai onboarding, atau response redirect jika sudah selesai
 */
async function checkIfUserHasOnboarded(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onBoardingComplete: true,
    },
  });

  if (user?.onBoardingComplete) {
    return redirect("/");
  }
  return user;
}

export default async function OnboardingPage() {
  const session = await requireUser();
  await checkIfUserHasOnboarded(session?.id as string);
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  );
}
