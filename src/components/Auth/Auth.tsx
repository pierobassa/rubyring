"use client" // This is a client component 👈🏽
import "@biconomy/web3-auth/dist/src/style.css"
import { Loader } from "../Loader"
import { useAccountStore } from "@/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import { ProfileCard } from "../ProfileCard"
const RubyRingHero = require("./ruby_ring_hero.png")

export default function Auth() {
    const { smartAccountAddress, socialAccountLoading, lensAccount } =
        useAccountStore()

    const router = useRouter()

    return (
        <section className="bg-[#170c10] text-white">
            <div className="mx-auto max-w-screen-xl px-4 py-4 lg:flex lg:h-screen">
                <div className="mx-auto max-w-3xl text-center mt-32">
                    {!socialAccountLoading && !smartAccountAddress && (
                        <>
                            <Image
                                className="h-72 w-auto mx-auto"
                                src={RubyRingHero}
                                alt="Your Company"
                            />
                            <h1 className="bg-gradient-to-r from-red-300 via-rose-700-500 to-pink-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
                                Pave the Path to
                                <span className="sm:block">
                                    {" "}
                                    Exclusive Interactions!{" "}
                                </span>
                            </h1>
                            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
                                Dive into unique social circles of your beloved
                                personas. With RubyRing, every interaction is a
                                gem of an experience.
                            </p>
                        </>
                    )}

                    {socialAccountLoading && !smartAccountAddress && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "80vh",
                            }}>
                            <Loader />
                        </div>
                    )}
                    {smartAccountAddress && (
                        <div>
                            <div className="font-bold text-xl py-3">
                                Your account
                            </div>
                            <ProfileCard
                                profileImage={
                                    //@ts-ignore
                                    lensAccount?.picture?.original?.url ?? ""
                                }
                                profileHandle={lensAccount?.handle ?? ""}
                                smartAccountAddress={smartAccountAddress}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
