// Use inter from next/font
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={inter.className}>
      <Suspense fallback={<div>Loading...</div>}>
        <></>
      </Suspense>
    </main>
  );
}
