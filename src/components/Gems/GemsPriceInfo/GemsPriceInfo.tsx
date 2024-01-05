import { ethers } from "ethers";
import { useMemo } from "react";
import { FaEthereum, FaGem } from "react-icons/fa";

type Props = {
  buyPrice: ethers.BigNumber;
  sellPrice: ethers.BigNumber;
  onBuyClick?: () => void;
  onSellClick?: () => void;
};

export const GemsPriceInfo: React.FC<Props> = ({
  buyPrice,
  sellPrice,
  onBuyClick,
  onSellClick
}) => {
  const buyPriceEther = useMemo(() => {
    return ethers.utils.formatEther(buyPrice);
  }, [buyPrice]);

  const sellPriceEther = useMemo(() => {
    return ethers.utils.formatEther(sellPrice);
  }, [sellPrice]);

  return (
    <div className="bg-[#FF89A9] flex flex-col items-center rounded-md text-[#2b2b2b] py-1 px-2">
      <div className="flex flex-row items-center gap-1 ">
        <div>
          <FaGem />
        </div>
        <p className="font-medium text-lg">Buy/Sell gems</p>
      </div>
      <div className="flex flex-row items-center gap-0.5 ">
        {onBuyClick ? (
          <button
            className="py-1 px-2 flex flex-row items-center bg-[#006400] hover:brightness-90 rounded-md "
            onClick={onBuyClick}
          >
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium">
              {buyPriceEther} ETH
            </div>
          </button>
        ) : (
          <div className="py-1 px-2 flex flex-row items-center bg-[#006400] rounded-md ">
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium">
              {buyPriceEther} ETH
            </div>
          </div>
        )}

        {onSellClick ? (
          <button
            className="py-1 px-2 flex flex-row items-center bg-[#99324e] hover:brightness-90 rounded-md "
            onClick={onSellClick}
          >
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium">
              {sellPriceEther} ETH
            </div>
          </button>
        ) : (
          <div className="py-1 px-2 flex flex-row items-center bg-[#99324e]  rounded-md ">
            <div className="text-white">
              <FaEthereum />
            </div>
            <div className="pl-1 text-white font-medium">
              {sellPriceEther} ETH
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
