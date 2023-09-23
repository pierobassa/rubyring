import { FaEthereum } from "react-icons/fa";
import { FormattingUtils } from "@/utils";
import Image from "next/image";
import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants";
import { useAccountInfo } from "@/hooks";
import { ethers } from "ethers";
import { useMemo } from "react";

type Props = {
  userAddress: string;
};

export const AccountBox = ({ userAddress }: Props) => {
  const { ethBalance, userInfo } = useAccountInfo(userAddress);

  const userEthBalance = useMemo(() => {
    return FormattingUtils.formatNumberPrecision(
      ethers.utils.formatEther(ethBalance ?? 0),
      2
    );
  }, [ethBalance]);

  return (
    <div className="bg-[#FF89A9] rounded-md">
      <div className="px-2 py-1 flex flex-row items-center">
        <Image
          width={32}
          height={32}
          className="rounded-full"
          src={userInfo?.profileImage ?? DEFUALT_USER_IMG_PLACEHOLDER}
          alt=""
        />
        <div className="ml-2 bg-[#99324E] rounded-md">
          <div className="py-1 px-2 flex flex-row items-center">
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium ">
              {userEthBalance} ETH
              {/* TODO: Display real balance */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
