import { BiconomyLensContext } from "@/providers"
import { useRouter } from "next/router"
import { useContext } from "react"

type Props = { Component: React.ReactNode }

/**
 *  This is a Higher Order Component that will render the component passed as a prop if the lensContext is available
 * @param param0  Component is the component that will be rendered if the lensContext is available
 * @returns
 */
export const WithLensContext: React.FC<Props> = ({ Component }) => {
    const router = useRouter()

    const lensContext = useContext(BiconomyLensContext)
    console.log({ lensContext })

    if (!lensContext) {
        router.push("/")
        return null
    }

    return Component
}
