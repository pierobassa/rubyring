"use client";
// Use inter from next/font
import { Inter } from "next/font/google";
import { Suspense } from "react";
import dynamic from "next/dynamic";

//eslint-disable-next-line

const inter = Inter({ subsets: ["latin"] });

const HomepageComponent = dynamic(
  () => import("@/components/Homepage/Homepage"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className={inter.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <HomepageComponent />
      </Suspense>
    </main>
  );
}
