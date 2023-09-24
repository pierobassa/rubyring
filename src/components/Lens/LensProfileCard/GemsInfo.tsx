import { useGemsInfo } from "@/hooks";

import { useMemo } from "react";
import { FaGem } from "react-icons/fa";

type Props = {
  gemSubject: string;
  address: string;
};
/**
 *  We assume that the provided addresses are smart accounts
 * @param param0  gemSubject: string; address: string;
 * @returns
 */
export const GemsInfo: React.FC<Props> = ({ gemSubject, address }) => {
  const { gemBalance } = useGemsInfo(gemSubject, address);

  const userGemBalance = useMemo(() => {
    return gemBalance.toNumber();
  }, [gemBalance]);

  return (
    <div className="flex items-center">
      <p className="font-light ">You own {userGemBalance}</p>
      {/* TODO: Replace with balance of gems owned */}
      <div className="pl-1">
        <FaGem />
      </div>
    </div>
  );
};
