import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { SearchBar } from "@/components"
import { ProfileOwnedByMe, useSearchProfiles } from "@lens-protocol/react-web"
import { useRouter } from "next/navigation"
import { LensProfileCard } from "../LensProfileCard"

type Props = {
    isOpen: boolean
    onClose: () => void
    activeProfile: ProfileOwnedByMe
}
export const SpotlightSearchLensProfilesDialog: React.FC<Props> = ({
    isOpen,
    onClose,
    activeProfile,
}) => {
    const router = useRouter()
    const [searchText, setSearchText] = useState<string>("")

    const handOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    // TODO: handle loading
    const {
        data: searchProfiles,
        //  loading
    } = useSearchProfiles({
        query: searchText,
    })

    console.log({ searchProfiles })

    return (
        <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}>
            <Dialog onClose={onClose} className={"z-10"}>
                <div
                    className="fixed inset-0 backdrop-blur-lg"
                    aria-hidden="true"
                />
                {/* Full-screen scrollable container */}

                {/* Container to center the panel */}
                {/* Full-screen scrollable container */}
                <div className="fixed inset-0 w-screen overflow-y-auto">
                    {/* Container to center the panel */}
                    <div className="flex min-h-full items-center justify-center ">
                        <Dialog.Panel className="w-1/2 mx-auto flex flex-col">
                            <SearchBar
                                placeholder="Search any lens profile..."
                                value={searchText}
                                onChange={handOnChange}
                                containerClassName="relative sticky top-0 z-10"
                                inputClassName="!rounded-b-none !bg-[#2b2b2b] text-white"
                            />
                            <div className="bg-[#2b2b2b] rounded-b-md flex flex-col items-center justify-center w-full">
                                {searchProfiles?.map(profile => (
                                    <LensProfileCard
                                        key={profile.handle}
                                        profile={profile}
                                        activeProfile={activeProfile}
                                        renderFollowButton={true}
                                        onProfileClick={() => {
                                            router.push(
                                                `/profile/${profile.handle}`,
                                            )
                                            onClose()
                                        }}
                                    />
                                ))}
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
