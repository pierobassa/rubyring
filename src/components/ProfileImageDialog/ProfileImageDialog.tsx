import { type } from "os"
import { BaseDialog } from "../Base"
import { ImageDropzone } from "../ImageDropzone"
import { useCallback, useMemo, useState } from "react"
import { isUndefined } from "lodash"
import { useProfile, useUpdateProfileImage } from "@lens-protocol/react-web"
import { useAccountInfo } from "@/Hooks"
import { useAccountStore } from "@/store"
import {
    RequestBodyBuilders,
    RubyRingAPI,
    web3StorageClient,
} from "@/Networking"
import { getWeb3StorageLink } from "../Lens/CreateLensProfileForm/helpers"
import toast from "react-hot-toast"
import { Loader } from "../Loader"
import axios from "axios"

type Props = {
    isOpen: boolean
    openModal: () => void
    closeModal: () => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

export default function ProfileImageDialog({
    isOpen,
    openModal,
    closeModal,
}: Props) {
    const { lensAccount } = useAccountStore()

    const [userImage, setUserImage] = useState<File>()

    const [loading, setLoading] = useState<boolean>(false)

    const {
        execute: update,
        error,
        isPending,
    } = useUpdateProfileImage({
        profile: lensAccount!,
    })

    const isSubmitDisabled = useMemo(() => {
        return isUndefined(userImage)
    }, [userImage])

    const uploadImage = useCallback(async () => {
        if (!userImage) return

        const cid = await web3StorageClient.put([userImage])

        console.log("stored files with cid:", cid)

        return cid
    }, [userImage])

    const updateProfilePic = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (!isSubmitDisabled) {
                try {
                    setLoading(true)
                    const cid = await uploadImage()

                    if (!cid) throw new Error("failed to upload image")

                    let web3StorageIPFSurl = getWeb3StorageLink(cid)

                    const imageURL = `${web3StorageIPFSurl}/${userImage?.name}`

                    await update(imageURL)
                    /* 
                    const { status } = await axios.post(
                        RubyRingAPI.ADD_RING_DATA_ENDPOINT,
                        RequestBodyBuilders.AddRingBodyBuilder(
                            lensAccount?.handle ?? "",
                            imageURL,
                        ),
                    )

                    if (status !== 200)
                        throw new Error("Failed to add ring to Backend") */

                    setLoading(false)
                } catch (error) {
                    console.error(error)
                    toast.error("Oops! Failed to update profile picture")
                }
            }
        },
        [isSubmitDisabled, update, uploadImage, userImage?.name],
    )

    return (
        <BaseDialog
            isOpen={isOpen}
            openModal={openModal}
            closeModal={closeModal}>
            <form onSubmit={updateProfilePic}>
                <div className="flex flex-col items-center justify-center w-full bg-stone-600 rounded-2xl py-6 px-4">
                    <div className="font-medium text-lg">
                        Change your profile picture
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center w-full h-[40vh]">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <ImageDropzone
                                onImageDropped={(image: File) =>
                                    setUserImage(image)
                                }
                            />
                            <button
                                className={classNames(
                                    "bg-[#FF89A9] flex justify-center items-center  rounded-md text-[#2b2b2b] w-full mt-8",
                                    isSubmitDisabled
                                        ? "cursor-not-allowed brightness-75"
                                        : " hover:brightness-90",
                                )}
                                disabled={isSubmitDisabled}>
                                <p className="py-2 px-2 font-medium uppercase text-base">
                                    Save
                                </p>
                            </button>
                        </>
                    )}
                </div>
            </form>
        </BaseDialog>
    )
}
