import { FormattingUtils } from "@/Utils"
import { FaGem } from "react-icons/fa"

type Props = {
    profileImage: string
    profileHandle: string
    smartAccountAddress: string
}

export const ProfileCard = ({
    profileImage,
    profileHandle,
    smartAccountAddress,
}: Props) => {
    return (
        <section className="w-64 mx-auto bg-stone-800 rounded-2xl px-8 py-6 shadow-lg shadow-stone-950">
            <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Ruby Ring member</span>
                <span className="text-[#ff89a9]">
                    <FaGem />
                </span>
            </div>
            <div className="mt-6 w-fit mx-auto">
                <img
                    src={profileImage}
                    className="rounded-full w-28 "
                    alt="profile picture"
                />
            </div>

            <div className="mt-8 ">
                <h2 className="text-white font-bold text-xl tracking-wide">
                    {profileHandle}
                </h2>
            </div>
            <p className="text-[#ff89a9] font-semibold mt-2.5">
                {FormattingUtils.humanAddress(smartAccountAddress, 4, 6)}
            </p>
        </section>
    )
}
