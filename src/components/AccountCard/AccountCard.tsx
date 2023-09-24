import { ethers } from "ethers"
import { DEFUALT_USER_IMG_PLACEHOLDER } from "../../Constants/Media"
import { OpenloginUserInfo } from "@toruslabs/openlogin"
import { FormattingUtils } from "../../Utils"
import { BiCopy } from "react-icons/bi"
import { FaEthereum } from "react-icons/fa"
import { useCallback, useMemo } from "react"
import { BaseSeparator, BaseSpacer } from ".."
import { useAccountInfo } from "../../Hooks"
import { BsSaveFill, BsSendFill } from "react-icons/bs"
import { IconContext } from "react-icons"
import { useAccountStore } from "@/store"
import { RiEditCircleFill } from "react-icons/ri"
import toast from "react-hot-toast"

type Props = {
    userInfo: Partial<OpenloginUserInfo>
    lensProfileImage?: string
    lensHandle?: string
    onProfileImageClick: () => void
}

export default function AccountCard({
    userInfo,
    lensProfileImage,
    lensHandle,
    onProfileImageClick,
}: Props) {
    const { smartAccountAddress } = useAccountStore()

    const { ethBalance, generatedValue } = useAccountInfo(
        smartAccountAddress ?? "",
    )

    const userEthBalance = useMemo(() => {
        return FormattingUtils.formatNumberPrecision(
            ethers.utils.formatEther(ethBalance ?? 0),
            3,
        )
    }, [ethBalance])

    const userGeneratedValue = useMemo(() => {
        return ethers.utils.formatEther(generatedValue ?? 0)
    }, [generatedValue])

    const userTotalValue = useMemo(() => {
        const totalEthValue = ethBalance?.add(generatedValue ?? 0)

        return FormattingUtils.formatNumberPrecision(
            ethers.utils.formatEther(totalEthValue ?? ethers.BigNumber.from(0)),
            5,
        )
    }, [ethBalance, generatedValue])

    const handleCopyAddress = useCallback(() => {
        navigator.clipboard.writeText(smartAccountAddress ?? "")

        toast.success("Copied address to clipboard")
    }, [smartAccountAddress])

    return (
        <div className="bg-[#2b2b2b] rounded-md self-center mx-auto max-w-xl">
            <div className="px-4 py-3">
                {/* Account info */}
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center justify-start">
                        <div
                            className="relative cursor-pointer"
                            onClick={onProfileImageClick}>
                            <img
                                className="h-14 w-14 md:h-20 md:w-20 rounded-full"
                                src={
                                    lensProfileImage
                                        ? lensProfileImage
                                        : userInfo?.profileImage ??
                                          DEFUALT_USER_IMG_PLACEHOLDER
                                }
                                alt="user-profile-img"
                            />
                            <IconContext.Provider value={{ size: "22" }}>
                                <RiEditCircleFill className="absolute bottom-1 right-1 bg-stone-600 rounded-full border border-white" />
                            </IconContext.Provider>
                        </div>
                        <div className="pl-2">
                            <p className="font-medium text-base">
                                {lensHandle ?? userInfo?.name}
                            </p>
                            <div
                                className="text-xs md:text-sm flex flex-row items-center cursor-pointer hover:text-stone-300 bg-stone-600 py-0.5 px-2 mt-1 rounded-lg"
                                onClick={handleCopyAddress}>
                                {FormattingUtils.humanAddress(
                                    smartAccountAddress ?? "",
                                    4,
                                    6,
                                )}
                                <div className="pl-2">
                                    <BiCopy />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b] text-xs md:text-sm">
                        <div className="py-1 px-2">
                            <p className="font-medium">Wallet balance</p>
                            <div className="py-1 px-2 flex flex-row items-center bg-[#99324E] rounded-md ">
                                <div className="text-white">
                                    <FaEthereum />
                                </div>
                                <div className="pl-1 text-white font-medium">
                                    {userEthBalance} ETH
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6">
                    <BaseSeparator color="#444444" />
                </div>

                <div className="flex flex-row items-center justify-center text-sm">
                    <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b]">
                        <div className="py-1 px-2">
                            <p className="font-medium">Total value</p>
                            <div className="py-1 px-2 flex flex-row items-center bg-[#99324E] rounded-md ">
                                <div className="text-white">
                                    <FaEthereum />
                                </div>
                                <div className="pl-1 text-white font-medium">
                                    {userTotalValue} ETH
                                </div>
                            </div>
                        </div>
                    </div>

                    <BaseSpacer width={24} />

                    <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b] text-sm">
                        <div className="py-1 px-2">
                            <p className="font-medium">Generated value</p>
                            <div className="py-1 px-2 flex flex-row items-center bg-[#99324E] rounded-md ">
                                <div className="text-white">
                                    <FaEthereum />
                                </div>
                                <div className="pl-1 text-white font-medium">
                                    {userGeneratedValue} ETH
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6">
                    <BaseSeparator color="#444444" />
                </div>

                <div className="flex flex-row items-center justify-center text-sm">
                    <button className="bg-[#FF89A9] hover:brightness-90 rounded-md text-[#2b2b2b] w-32">
                        <div className="px-3 flex flex-col items-center justify-center py-3">
                            <IconContext.Provider value={{ size: "32" }}>
                                <BsSaveFill />
                            </IconContext.Provider>

                            <BaseSpacer height={12} />

                            <p className="font-medium">Deposit ETH</p>
                        </div>
                    </button>

                    <BaseSpacer width={24} />

                    <div className="bg-[#FF89A9] hover:brightness-90 rounded-md text-[#2b2b2b] w-32">
                        <button className="px-3 flex flex-col items-center justify-center py-3 ">
                            <IconContext.Provider value={{ size: "32" }}>
                                <BsSendFill />
                            </IconContext.Provider>

                            <BaseSpacer height={12} />

                            <p className="font-medium">Withdraw ETH</p>
                        </button>
                    </div>
                </div>

                <div className="py-6">
                    <BaseSeparator color="#444444" />
                </div>

                <div>
                    <div className="w-full flex items-center justify-center">
                        <button className="bg-[#FF89A9] hover:brightness-90 rounded-md text-[#2b2b2b] w-[17rem]">
                            <p className="py-2 px-2 font-medium uppercase text-base">
                                Export wallet
                            </p>
                        </button>
                    </div>

                    <BaseSpacer height={12} />

                    <div className="w-full flex items-center justify-center">
                        <button className="bg-stone-600 hover:brightness-90 rounded-md text-white w-[17rem]">
                            <p className="py-2 px-2 font-medium uppercase text-base">
                                Log out
                            </p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
