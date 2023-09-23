// Use inter from next/font
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { useAccountStore } from "@/store";
import { BeatLoader } from "react-spinners";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { socialAccountLoading, smartAccountAddress } = useAccountStore();
  return (
    <main className={inter.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
          }}
        >
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
        </div>
      </Suspense>
    </main>
  );
}
