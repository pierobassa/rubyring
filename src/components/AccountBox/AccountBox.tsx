import { ethers } from "ethers"
import { useMemo } from "react"
import { useAccountInfo } from "@/hooks"
import { FaEthereum } from "react-icons/fa"
import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants"
import { FormattingUtils } from "@/utils"

type Props = {
    userImg: string
    userAddress: string
}

export const AccountBox = ({ userImg, userAddress }: Props) => {
    const { ethBalance } = useAccountInfo(userAddress)

    const userEthBalance = useMemo(() => {
        return FormattingUtils.formatNumberPrecision(
            ethers.utils.formatEther(ethBalance ?? 0),
            2,
        )
    }, [ethBalance])

    return (
        <div className="bg-[#FF89A9] rounded-md">
            <div className="px-2 py-1 flex flex-row items-center">
                <img
                    className="h-8 w-8 rounded-full"
                    src={
                        userImg ?? DEFUALT_USER_IMG_PLACEHOLDER //TODO: Default placeholder user image
                    }
                    alt=""
                />
                <div className="ml-2 bg-[#99324E] rounded-md">
                    <div className="py-1 px-2 flex flex-row items-center">
                        <div className="text-white">
                            <FaEthereum />
                        </div>
                        <div className="pl-1 text-white font-medium ">
                            {userEthBalance} ETH
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
