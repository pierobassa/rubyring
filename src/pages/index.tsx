// Use inter from next/font
"use client";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { useAccountStore } from "@/store";
import { BeatLoader } from "react-spinners";
import { WithLensContext } from "@/providers";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

const LensAccountCard = dynamic(
  () =>
    import("@/components/Lens/LensAccountCard/LensAccountCard").then(
      (res) => res.default
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
          {smartAccountAddress && (
            <h1 className="text-green-800">
              Logged in as: {smartAccountAddress}
            </h1>
          )}
          <div className="w-1/2 self-center">
            <WithLensContext Component={<LensAccountCard />} />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
