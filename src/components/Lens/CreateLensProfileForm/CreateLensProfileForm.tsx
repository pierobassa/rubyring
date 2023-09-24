import { ImageDropzone, InputField, Loader3D } from "@/components"
import {
    useCreateProfile,
    useProfilesOwnedByMe,
    useUpdateProfileImage,
} from "@lens-protocol/react-web"
import React, {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import {
    RequestBodyBuilders,
    RubyRingAPI,
    web3StorageClient,
} from "@/Networking"
import { Filelike } from "web3.storage"
import { FaGem } from "react-icons/fa"
import { getWeb3StorageLink } from "./helpers"
import { Loader } from "@/components/Loader"
import { useAccountStore } from "@/store"
import axios from "axios"
import toast from "react-hot-toast"

type Props = {
    setStep: Dispatch<SetStateAction<number>>
    displayLabel?: boolean
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

export default function CreateLensProfileForm({ setStep }: Props) {
    const [handle, setHandle] = useState<string>("")

    const { smartAccountAddress } = useAccountStore()

    const [loading, setLoading] = useState<boolean>(false)

    const {
        execute: createProfile,
        isPending: isCreateProfilePending,
        error: createProfileError,
    } = useCreateProfile()

    const {
        data: profiles,
        loading: profilesOwnedLoading,
        hasMore,
        next,
    } = useProfilesOwnedByMe({
        limit: 10,
    })

    const handleOnHandleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const text = event.target.value

            setHandle(text)
        },
        [],
    )

    const onCreateSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            try {
                setLoading(true)

                console.log("creating profile", handle)

                await createProfile({ handle })

                if (!smartAccountAddress)
                    throw new Error("Smart account address not found")

                const { status } = await axios.post(
                    RubyRingAPI.ADD_RING_DATA_ENDPOINT,
                    RequestBodyBuilders.AddRingBodyBuilder(
                        handle,
                        smartAccountAddress,
                    ),
                )

                if (status !== 200) throw new Error("failed to add ring data")

                setLoading(false)
                setHandle("")
            } catch (error) {
                console.error("create profile failed", error)
                toast.error("Oops! Something went wrong. Please try again.")

                setLoading(false)
            }
        },
        [createProfile, handle, smartAccountAddress],
    )

    const isSubmitDisabled = useMemo(() => {
        return !handle
    }, [handle])

    // Lens Account created successfully
    useEffect(() => {
        if (profiles?.length !== 0) {
            //Move to onboarding completed
            setStep(1)
        }
    }, [profiles, setStep])

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center w-full h-[40vh]">
                <Loader />
            </div>
        )

    return (
        <form
            className="flex flex-col w-full items-center justify-between"
            onSubmit={onCreateSubmit}>
            <div className="w-full">
                <InputField
                    title="Your handle"
                    inputType="text"
                    placeholder="Create your Ruby Lens handle..."
                    type="text"
                    id="lens-handle"
                    onChange={handleOnHandleChange}
                    error={createProfileError?.message}
                />
            </div>
            <button
                className={classNames(
                    "bg-[#FF89A9] flex justify-center items-center  rounded-md text-[#2b2b2b] w-full mt-8",
                    isSubmitDisabled
                        ? "cursor-not-allowed brightness-75"
                        : " hover:brightness-90",
                )}
                disabled={isSubmitDisabled}>
                <p className="py-2 px-2 font-medium uppercase text-base">
                    Next: Add profile picture
                </p>
                <FaGem />
            </button>
        </form>
    )
}
