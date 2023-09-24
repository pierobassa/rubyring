"use client"
import "@biconomy/web3-auth/dist/src/style.css"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import dynamic from "next/dynamic"
import Toast from "@/Toast"

const BiconomyLensProvider = dynamic(
    () => import("../Providers/").then(res => res.BiconomyLensProvider),
    { ssr: false },
)

const Navbar = dynamic(
    () => import("../components/Navbar/Navbar").then(res => res.default),
    {
        ssr: false,
    },
)

export default function App({ Component, pageProps }: AppProps) {
    return (
        <BiconomyLensProvider>
            <Toast />
            <Navbar />
            <div className="bg-[#170c10] h-screen">
                <Component {...pageProps} />
            </div>
        </BiconomyLensProvider>
    )
}
