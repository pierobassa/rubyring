import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { BiconomyLensContext } from "..";

type Props = { Component: React.ReactNode };

/**
 *  This is a Higher Order Component that will render the component passed as a prop if the lensContext is available
 * @param param0  Component is the component that will be rendered if the lensContext is available
 * @returns
 */
export const WithLensContext: React.FC<Props> = ({ Component }) => {
  const router = useRouter();

  const lensContext = useContext(BiconomyLensContext);

  useEffect(() => {
    console.log({ lensContext });
    if (!lensContext) {
      router.push("/");
    }
  }, [lensContext, router]);

  if (!lensContext) {
    return null;
  }

  return Component;
};
