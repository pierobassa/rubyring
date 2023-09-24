import React from "react"
import { GemLoader3D } from "../../Assets"
import Lottie from "lottie-react"

export const Loader3D = () => {
    return (
        <Lottie
            animationData={GemLoader3D}
            style={{ height: "14vh", width: "14vh" }}
        />
    )
}
