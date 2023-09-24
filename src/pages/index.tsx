// Use inter from next/font
"use client";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { useAccountStore } from "@/store";
import { BeatLoader } from "react-spinners";
import { WithLensContext } from "@/providers";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const LensProfileCard = dynamic(
  () =>
    import("@/components/Lens/LensProfileCard/LensProfileCard").then(
      (res) => res.LensProfileCard
    ),
  {
    ssr: false
  }
);

export default function Home() {
  const { socialAccountLoading, smartAccountAddress } = useAccountStore();
  return (
    <main className={inter.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col h-[80vh] w-full justify-center items-center gap-4">
          {!socialAccountLoading && !smartAccountAddress && (
            <h1>Login to start using the app</h1>
          )}
          {socialAccountLoading && !smartAccountAddress && (
            <BeatLoader
              color={"white"}
              loading={true}
              size={12}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          )}
          <div className="w-1/2 self-center flex flex-col gap-2">
            {smartAccountAddress && (
              <h1 className="font-bold text-xl self-start">Your profile</h1>
            )}

            <WithLensContext Component={<LoggedAccountProfileCard />} />
          </div>
        </div>
      </Suspense>
    </main>
  );
}

const LoggedAccountProfileCard = () => {
  const { lensAccount } = useAccountStore();

  if (!lensAccount) return null;
  return (
    <LensProfileCard
      cardClassName="bg-[#2b2b2b] rounded-md p-4"
      activeProfile={lensAccount}
      profile={lensAccount}
      renderFollowButton={false}
    />
  );
};
