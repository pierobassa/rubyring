import { FaEthereum, FaGem } from "react-icons/fa";
import { BaseDialog, BaseSeparator, BaseSpacer } from "../Base";
import { DEFUALT_USER_IMG_PLACEHOLDER } from "../../Constants/Media";
import Image from "next/image";

type Props = {
  userName: string;
  userImg: string;
  userAddress: string;
  gemSubjectAddress: string;
  isOpen: boolean;
  buyPriceEther: string;
  sellPriceEther: string;
  gemBalanceEther: number;
  onBuyPress: () => void;
  onSellPress: () => void;
  openModal: () => void;
  closeModal: () => void;
};

export default function TradeDialog({
  userImg,
  userName,
  isOpen,
  buyPriceEther,
  sellPriceEther,
  gemBalanceEther,
  onBuyPress,
  onSellPress,
  openModal,
  closeModal
}: Props) {
  return (
    <BaseDialog isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
      <div className="flex flex-col items-center justify-center w-full bg-stone-600 rounded-2xl py-6 px-4">
        <p className="text-white font-medium uppercase">TRADE GEMS</p>
        <div className="mt-3 w-full">
          <div className="flex flex-row items-center justify-between ">
            <div className="flex flex-row items-center">
              <Image
                className="h-12 w-12 md:h-20 md:w-20 rounded-full"
                src={userImg ?? DEFUALT_USER_IMG_PLACEHOLDER}
                alt="user-profile-img"
              />
              <div className="pl-3">
                <p className="font-medium text-base">{userName}</p>
                <div className="flex items-center">
                  <p className="font-light ">You own {gemBalanceEther}</p>
                  {/* TODO: Replace with balance of gems owned */}
                  <div className="pl-1">
                    <FaGem />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b] text-xs md:text-sm">
              <div className="py-1 px-2">
                <div className="flex items-center">
                  <div>
                    <FaGem />
                  </div>
                  <p className="font-medium pl-2">Gem Price</p>
                </div>

                <div className="py-1 px-2 flex flex-row items-center bg-[#99324E] rounded-md ">
                  <div className="text-white">
                    <FaEthereum />
                  </div>
                  <div className="pl-1 text-white font-medium">
                    {buyPriceEther} ETH
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-6">
            <BaseSeparator color="#444444" />
          </div>

          <div>
            <div className="w-full flex items-center justify-center">
              <button
                className="bg-[#FF89A9] hover:brightness-90 rounded-md text-[#2b2b2b] w-[17rem]"
                onClick={onBuyPress}
              >
                <p className="py-2 px-2 font-medium uppercase text-base">
                  Buy gem
                </p>
              </button>
            </div>

            <BaseSpacer height={12} />

            <div className="w-full flex items-center justify-center">
              <button
                className="bg-stone-700 hover:brightness-90 rounded-md text-white w-[17rem]"
                onClick={onSellPress}
              >
                <p className="py-2 px-2 font-medium uppercase text-base">
                  Sell gem
                </p>
              </button>
            </div>
            <div
              className="pt-2 w-full flex items-center justify-center font-light text-sm text-stone-300"
              onClick={onSellPress}
            >
              Sell price: {sellPriceEther} ETH
            </div>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}
