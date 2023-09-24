import dynamic from "next/dynamic"
// Use inter from next/font
import { Inter } from "next/font/google"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

const Auth = dynamic(() => import("../components/Auth/Auth"), { ssr: false })

export default function Home() {
    return (
        <main className={inter.className}>
            <Suspense fallback={<div>Loading...</div>}>
                <Auth />
            </Suspense>
        </main>
    )
}
