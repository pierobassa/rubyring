import { web3StorageClient } from "@/Networking"
import { useAccountStore } from "@/store"
import { ContentFocus, useCreatePost } from "@lens-protocol/react-web"
import { ChangeEvent, useCallback, useMemo, useState } from "react"
import { getWeb3StorageLink } from "../Lens/CreateLensProfileForm/helpers"
import toast from "react-hot-toast"
import { FaGem } from "react-icons/fa"
import { BeatLoader } from "react-spinners"

type Props = {
    refetchPublications: () => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ")
}

export default function CreatePost({ refetchPublications }: Props) {
    const { lensAccount } = useAccountStore()

    const [postText, setPostText] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)

    const upload = useCallback(async (data: unknown): Promise<string> => {
        const serialized = JSON.stringify(data)

        const blob = new Blob([serialized], { type: "application/json" })

        const name = blob.name

        const cid = await web3StorageClient.put([new File([blob], name)])

        let web3StorageIPFSurl = getWeb3StorageLink(cid)

        const url = `${web3StorageIPFSurl}/${name}`

        return url
    }, [])

    const {
        execute: createPost,
        error,
        isPending,
    } = useCreatePost({
        publisher: lensAccount!,
        upload,
    })

    const handleOnTextChange = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value

            setPostText(value)
        },
        [],
    )

    const onPostCreate = useCallback(async () => {
        try {
            setLoading(true)

            await createPost({
                content: postText,
                contentFocus: ContentFocus.TEXT_ONLY,
                locale: "en",
            })

            refetchPublications()

            toast.success("Post published to your Ring")
            setLoading(false)

            setPostText("")
        } catch (error) {
            console.error(error)
            setLoading(false)

            toast.error("Oops! Something went wrong, try again.")
        }
    }, [createPost, postText, refetchPublications])

    const isPostDisabled = useMemo(() => {
        return postText.length === 0
    }, [postText])

    return (
        <>
            <div className="w-full mb-4 border rounded-lg  bg-[#2b2b2b] border-gray-600">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-600">
                    <div className="flex flex-wrap items-center  sm:divide-x divide-gray-600">
                        <div className="flex items-center space-x-1 sm:pr-4">
                            <button
                                type="button"
                                className="p-2  rounded cursor-pointer  text-[#ff89a9] hover:text-white hover:bg-gray-600">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 12 20">
                                    <path
                                        stroke="currentColor"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                                    />
                                </svg>
                                <span className="sr-only">Attach file</span>
                            </button>
                            <button
                                type="button"
                                className="p-2  rounded cursor-pointer  text-[#ff89a9] hover:text-white hover:bg-gray-600">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20">
                                    <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                                </svg>
                                <span className="sr-only">Embed map</span>
                            </button>
                            <button
                                type="button"
                                className="p-2 rounded cursor-pointer   text-[#ff89a9] hover:text-white hover:bg-gray-600">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20">
                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                </svg>
                                <span className="sr-only">Upload image</span>
                            </button>
                            <button
                                type="button"
                                className="p-2  rounded cursor-pointer   text-[#ff89a9] hover:text-white hover:bg-gray-600">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 16 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M14.067 0H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.933-2ZM6.709 13.809a1 1 0 1 1-1.418 1.409l-2-2.013a1 1 0 0 1 0-1.412l2-2a1 1 0 0 1 1.414 1.414L5.412 12.5l1.297 1.309Zm6-.6-2 2.013a1 1 0 1 1-1.418-1.409l1.3-1.307-1.295-1.295a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1-.001 1.408v.004Z" />
                                </svg>
                                <span className="sr-only">Format code</span>
                            </button>
                            <button
                                type="button"
                                className="p-2  rounded cursor-pointer text-[#ff89a9] hover:text-white hover:bg-gray-600">
                                <svg
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.5 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm-7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm3.5 9.5A5.5 5.5 0 0 1 4.6 11h10.81A5.5 5.5 0 0 1 10 15.5Z" />
                                </svg>
                                <span className="sr-only">Add emoji</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-b-lg bg-[#434343]">
                    <textarea
                        id="editor"
                        rows={8}
                        value={postText}
                        className="block w-full px-0 text-sm border-0 bg-[#434343] text-white placeholder-stone-200 ring-black ring-opacity-5 focus:outline-none"
                        placeholder="What are you thinking..."
                        required
                        onChange={handleOnTextChange}
                    />
                </div>
            </div>
            <button
                onClick={onPostCreate}
                className={classNames(
                    "bg-[#FF89A9] flex justify-center items-center  rounded-md text-[#2b2b2b] mt-4 px-6 w-42",
                    isPostDisabled
                        ? "cursor-not-allowed brightness-75"
                        : " hover:brightness-90",
                )}
                disabled={isPostDisabled}>
                {loading ? (
                    <div className="py-2 px-8">
                        <BeatLoader
                            color={"white"}
                            loading={true}
                            size={8}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                ) : (
                    <>
                        <p className="py-2 px-2 font-medium uppercase text-base">
                            Publish
                        </p>
                        <FaGem />
                    </>
                )}
            </button>
        </>
    )
}
