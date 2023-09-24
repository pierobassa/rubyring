import { IBundler, Bundler } from "@biconomy/bundler"
import { config } from "../../config"
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"

export const bundler: IBundler = new Bundler({
    bundlerUrl: config.bundlerUrl,
    chainId: config.networkId,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
})
