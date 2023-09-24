import { create } from "zustand"
import { devtools } from "zustand/middleware"
import {
    BiconomySmartAccount,
    BiconomySmartAccountConfig,
} from "@biconomy/account"
import SocialLogin from "@biconomy/web3-auth"
import { ethers } from "ethers"
import { ChainId } from "@biconomy/core-types"
import { bundler } from "@/Networking"
import { Profile, ProfileOwnedByMe } from "@lens-protocol/react-web"

interface AccountState {
    smartAccount?: BiconomySmartAccount
    smartAccountAddress?: string
    lensAccount?: ProfileOwnedByMe
    accountPrivateKey?: string
    socialLoginSdk?: SocialLogin
    provider?: ethers.providers.Web3Provider
    socialAccountLoading: boolean
    initializeSocialAccount: (sdk: SocialLogin) => Promise<void>
    setSocialAccountLoading: (isAccountLoading: boolean) => void
    setLensAccount: (lensAccount: ProfileOwnedByMe) => void
    clear: () => void
}

export const useAccountStore = create<AccountState>()(
    devtools((set, get) => ({
        smartAccount: undefined,
        smartAccountAddress: undefined,
        lensAccount: undefined,
        accountPrivateKey: undefined,
        socialLoginSdk: undefined,
        provider: undefined,
        socialAccountLoading: false,
        initializeSocialAccount: async (sdk: SocialLogin) => {
            if (!sdk.provider) return
            set({ ...get(), socialAccountLoading: true })
            const web3Provider = new ethers.providers.Web3Provider(sdk.provider)

            const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
                signer: web3Provider.getSigner(),
                chainId: ChainId.POLYGON_MUMBAI,
                bundler: bundler,
            }

            let biconomySmartAccount = new BiconomySmartAccount(
                biconomySmartAccountConfig,
            )

            biconomySmartAccount = await biconomySmartAccount.init()

            console.log(
                "deployed: ",
                await biconomySmartAccount.isAccountDeployed(
                    await biconomySmartAccount.getSmartAccountAddress(),
                ),
            )
            const smartAccountAddress =
                await biconomySmartAccount.getSmartAccountAddress()
            const privateKey = (await sdk.getPrivateKey()) as string

            set({
                ...get(),
                socialAccountLoading: false,
                socialLoginSdk: sdk,
                smartAccount: biconomySmartAccount,
                smartAccountAddress,
                accountPrivateKey: privateKey,
                provider: web3Provider,
            })
        },
        setSocialAccountLoading: (isLoading: boolean) =>
            set({ ...get(), socialAccountLoading: isLoading }),
        setLensAccount: (lensAccount: ProfileOwnedByMe) =>
            set({ ...get(), lensAccount }),
        clear: () =>
            set({
                ...get(),
                smartAccount: undefined,
                smartAccountAddress: undefined,
                accountPrivateKey: undefined,
                socialLoginSdk: undefined,
                provider: undefined,
            }),
    })),
)
