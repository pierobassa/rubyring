import { SuccessAnimationLottie } from "@/components"
import { useAccountStore } from "@/store"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { IconContext } from "react-icons"
import { FaGem } from "react-icons/fa"

const Breadcrumbs = dynamic(
    () =>
        import("../components/Breadcrumbs/Breadcrumbs").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

const CreateLensProfileForm = dynamic(
    () =>
        import(
            "../components/Lens/CreateLensProfileForm/CreateLensProfileForm"
        ).then(res => res.default),
    {
        ssr: false,
    },
)

const AddProfilePictureForm = dynamic(
    () =>
        import(
            "../components/Lens/AddProfilePictureForm/AddProfilePictureForm"
        ).then(res => res.default),
    {
        ssr: false,
    },
)

const ONBOARDING_STEPS = ["Account Handle", "Account image", "Account ready"]

export default function Onboarding() {
    const [activeStepIndex, setActiveStepIndex] = useState<number>(0)

    const { lensAccount } = useAccountStore()

    const renderOnboardingStep = useMemo(() => {
        switch (activeStepIndex) {
            case 0:
                return <CreateLensProfileForm setStep={setActiveStepIndex} />
            case 1:
                return <AddProfilePictureForm setStep={setActiveStepIndex} />
            case 2:
            case 3:
                return (
                    <div className="flex flex-col items-center justify-center w-full h-[30vh]">
                        <SuccessAnimationLottie />
                        <Link href={`/profile/${lensAccount?.handle}`}>
                            <button
                                className={
                                    "bg-[#FF89A9] flex justify-center items-center  rounded-md text-[#2b2b2b] w-full mt-8 hover:brightness-90"
                                }>
                                <p className="py-2 px-2 font-medium uppercase text-base">
                                    Start posting
                                </p>
                                <FaGem />
                            </button>
                        </Link>
                    </div>
                )
        }
    }, [activeStepIndex])

    return (
        <div className="px-4">
            <div className="bg-[#2b2b2b] rounded-md mx-auto max-w-2xl mt-8 py-4">
                <div className="py-4 flex flex-col items-center">
                    <div className="flex justify-center">
                        <IconContext.Provider
                            value={{ size: "32", color: "#FF89A9" }}>
                            <FaGem />
                        </IconContext.Provider>
                    </div>
                    <div className="justify-center flex font-medium text-xl py-4">
                        Complete your Ruby Ring Account
                    </div>
                    <div className="py-4">
                        <Breadcrumbs
                            steps={ONBOARDING_STEPS}
                            currentStep={activeStepIndex}
                        />
                    </div>
                    <div className="w-full px-4 md:w-3/4 mt-4">
                        {renderOnboardingStep}
                    </div>
                </div>
            </div>
        </div>
    )
}
