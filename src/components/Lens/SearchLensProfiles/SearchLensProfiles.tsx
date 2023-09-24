import { useDisclosure } from "@/hooks"
import { SearchBar, SpotlightSearchLensProfilesDialog } from "@/components"
import { useActiveProfile } from "@lens-protocol/react-web"
import { useCallback } from "react"

export const SearchLensProfiles = () => {
    const { data: activeProfile } = useActiveProfile()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handOnChange = useCallback(() => {
        onOpen()
    }, [onOpen])

    return (
        <>
            {isOpen && activeProfile && (
                <SpotlightSearchLensProfilesDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    activeProfile={activeProfile}
                />
            )}
            <SearchBar
                placeholder="Search any lens profile..."
                value={""}
                onChange={handOnChange}
                onClick={onOpen}
            />
        </>
    )
}
