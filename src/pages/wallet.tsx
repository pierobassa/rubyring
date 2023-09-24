"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { isUndefined } from "lodash"
import { OpenloginUserInfo } from "@toruslabs/openlogin"
import dynamic from "next/dynamic"
import { useAccountStore } from "@/store"
import { useDialog } from "@/hooks"
import { useProfile } from "@lens-protocol/react-web"

const AccountCard = dynamic(
    () =>
        import("../components/AccountCard/AccountCard").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

const ProfileImageDialog = dynamic(
    () =>
        import("../components/ProfileImageDialog/ProfileImageDialog").then(
            res => res.default,
        ),
    {
        ssr: false,
    },
)

export default function Wallet() {
    const router = useRouter()

    const { smartAccount, socialLoginSdk, lensAccount } = useAccountStore()

    const [userInfo, setUserInfo] = useState<
        Partial<OpenloginUserInfo> | null | undefined
    >(null)

    const {
        isOpen: isUserImageDialogOpen,
        openModal: openUserImageDialog,
        closeModal: closeUserImageDialog,
    } = useDialog()

    // If the user is not logged in, redirect to the home page
    if (!smartAccount) {
        router.push("/")
    }

    useEffect(() => {
        if (isUndefined(smartAccount)) return

        const getUserInfo = async () => {
            const userInfo = await socialLoginSdk?.getUserInfo()

            setUserInfo(userInfo)
        }

        getUserInfo()
    }, [socialLoginSdk, smartAccount])

    const { data: profile, loading } = useProfile({
        handle: lensAccount?.handle ?? "",
    })

    const lensProfileImage = useMemo(() => {
        if (!profile) return ""

        //@ts-ignore
        return profile?.picture?.original?.url
    }, [profile])

    return (
        <>
            <div className="pt-12 w-full px-4">
                <AccountCard
                    userInfo={userInfo!}
                    onProfileImageClick={openUserImageDialog}
                    lensProfileImage={lensProfileImage ?? ""}
                    lensHandle={lensAccount?.handle ?? ""}
                />
            </div>
            <ProfileImageDialog
                isOpen={isUserImageDialogOpen}
                openModal={openUserImageDialog}
                closeModal={closeUserImageDialog}
            />
        </>
    )
}
