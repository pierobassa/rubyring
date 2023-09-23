"use client";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { Navbar } from "../components";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
