"use client";
import dynamic from "next/dynamic";
import "@biconomy/web3-auth/dist/src/style.css";
import "../styles/global.css";
import type { AppProps } from "next/app";

const Navbar = dynamic(
  () => import("../components/Navbar").then((res) => res.Navbar),
  {
    ssr: false
  }
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
