import { FaEthereum } from "react-icons/fa";
import { FormattingUtils } from "@/utils";

type Props = {
  userImg: string;
  userAddress: string;
};

export const AccountBox = ({ userAddress }: Props) => {
  return (
    <div className="bg-[#FF89A9] rounded-md">
      <div className="px-2 py-1 flex flex-row items-center">
        {/* <Image
          width={8}
          height={8}
          className="rounded-full"
          src={
            userImg ?? DEFUALT_USER_IMG_PLACEHOLDER //TODO: Default placeholder user image
          }
          alt=""
        /> */}
        <div className="pl-2 text-white font-medium truncate">
          {FormattingUtils.humanAddress(userAddress)}
        </div>
        <div className="ml-2 bg-[#99324E] rounded-md">
          <div className="py-1 px-2 flex flex-row items-center">
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium ">
              {0.0} ETH
              {/* TODO: Display real balance */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
