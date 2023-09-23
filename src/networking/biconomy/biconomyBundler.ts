import { IBundler, Bundler } from "@biconomy/bundler";
import { config } from "@/config";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";

/**
 * Biconomy bundler instance
 * @see https://docs.biconomy.io/docs/smartAccountv1/quickstartv1
 *
 */
export const biconomyBundler: IBundler = new Bundler({
  bundlerUrl: config.bundlerUrl,
  chainId: config.networkId,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});
