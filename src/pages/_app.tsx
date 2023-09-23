"use client";
import dynamic from "next/dynamic";
import "@biconomy/web3-auth/dist/src/style.css";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { CreateLensAccountHandler } from "@/providers";

const BiconomyLensProvider = dynamic(
  () =>
    import("@/providers/BiconomyLensProvider").then(
      (res) => res.BiconomyLensProvider
    ),
  { ssr: false }
);

const Navbar = dynamic(
  () => import("../components/Navbar").then((res) => res.Navbar),
  {
    ssr: false
  }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BiconomyLensProvider>
      <CreateLensAccountHandler />
      <Navbar />
      <Component {...pageProps} />
    </BiconomyLensProvider>
  );
}
