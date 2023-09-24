import { AccountBox } from "@/components"
import { Menu, Transition } from "@headlessui/react"
import Link from "next/link"
import { Fragment, useMemo } from "react"
import { AccountInfo, useAccountInfo } from "@/Hooks"
import { useProfile, useWalletLogout } from "@lens-protocol/react-web"
import { useAccountStore } from "@/store"

const navigation = [{ name: "Explore", href: "#", current: true }] // TODO: Do we need navigation menu?

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

type Props = {
    address: string
    onLogout: () => void
}
export const LoggedInAccount: React.FC<Props> = ({ address, onLogout }) => {
    const { userInfo } = useAccountInfo(address)
    const { execute: lensLogout, isPending } = useWalletLogout()

    const { lensAccount } = useAccountStore()

    const { data: profile, loading } = useProfile({
        handle: lensAccount?.handle ?? "",
    })

    const lensProfileImage = useMemo(() => {
        if (!profile) return ""

        //@ts-ignore
        return profile?.picture?.original?.url ?? ""
    }, [profile])

    const handleLogout = () => {
        lensLogout()
        onLogout()
    }

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="relative flex rounded-md bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <AccountBox
                        userImg={
                            lensProfileImage
                                ? lensProfileImage
                                : userInfo?.profileImage ?? ""
                        } //TODO: Default placeholder user image
                        userAddress={address}
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95">
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-stone-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href={`/profile/${lensAccount?.handle}`}
                                className={classNames(
                                    active
                                        ? "text-[#FF89A9] bg-[#2b2b2b] rounded-md"
                                        : "",
                                    "block px-4 py-2 text-sm text-white",
                                )}>
                                Profile
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href={"/wallet"}
                                className={classNames(
                                    active
                                        ? "text-[#FF89A9] bg-[#2b2b2b] rounded-md"
                                        : "",
                                    "block px-4 py-2 text-sm text-white ",
                                )}>
                                Wallet
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                onClick={handleLogout}
                                className={classNames(
                                    active
                                        ? "text-[#FF89A9] bg-[#2b2b2b] rounded-md"
                                        : "",
                                    "block px-4 py-2 text-sm text-white",
                                )}>
                                Log out
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
