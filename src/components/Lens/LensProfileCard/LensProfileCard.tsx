import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants"
import { FormattingUtils } from "@/utils"
import {
    Profile,
    ProfileOwnedByMe,
    useFollow,
    useUnfollow,
} from "@lens-protocol/react-web"
import Image from "next/image"
import { useCallback } from "react"
import { BeatLoader } from "react-spinners"
import { GemsInfo } from "./GemsInfo"
import { useAccountInfo, useResolveEoaAddress } from "@/hooks"

type Props = {
    activeProfile: ProfileOwnedByMe
    profile: Profile
    onProfileClick?: () => void
    renderFollowButton?: boolean
    cardClassName?: string
}

export const LensProfileCard: React.FC<Props> = ({
    activeProfile,
    profile,
    onProfileClick,
    renderFollowButton = true,
    cardClassName,
}) => {
    const { smartAccountAddress } = useAccountInfo()
    const { smartAccountAddress: subjectSmartAccountAddress } =
        useResolveEoaAddress(profile.handle)

    //TODO: handle errors
    const {
        execute: follow,
        // error: followError,
        isPending: followPending,
    } = useFollow({
        followee: profile,
        follower: activeProfile,
    })
    const {
        execute: unfollow,
        // error: unfollowError,
        isPending: unfollowPending,
    } = useUnfollow({
        followee: profile,
        follower: activeProfile,
    })

    const getProfilePicture = useCallback(() => {
        if (profile.picture?.__typename === "MediaSet") {
            const ipfsUrl = FormattingUtils.ipfsUriToHttps(
                profile.picture.original.url,
            )
            return ipfsUrl ?? profile.picture.original.url
        } else {
            return DEFUALT_USER_IMG_PLACEHOLDER
        }
    }, [profile])

    const isFollowed = profile.followStatus?.isFollowedByMe
    const canFollow = profile.followStatus?.canFollow
    const canUnfollow = profile.followStatus?.canUnfollow
    const isButtonDisabled = !canFollow && !canUnfollow
    const isLoading = followPending || unfollowPending
    //TODO: handle error
    // const error = followError || unfollowError;

    const handleOnFollowClick = useCallback(() => {
        if (isFollowed) {
            unfollow()
        } else {
            follow()
        }
    }, [isFollowed, follow, unfollow])

    return (
        <div
            className={`relative w-full flex items-center justify-between px-4 py-4 border-b border-gray-700 ${cardClassName}`}>
            <div className="flex items-center gap-2">
                <Image
                    width={12}
                    height={12}
                    className="w-12 h-12 rounded-full"
                    src={getProfilePicture()}
                    alt={`${profile.name}'s profile picture`}
                />
                <div
                    onClick={onProfileClick}
                    className={` ${
                        onProfileClick && "cursor-pointer hover:text-blue-500"
                    } flex flex-col gap-1`}>
                    <h3 className="m-0 text-sm text-gray-400 font-normal">
                        {profile.handle}
                    </h3>
                    <h1 className="m-0 text-sm font-bold text-white">
                        {profile.id}
                    </h1>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-center">
                {renderFollowButton && (
                    <button
                        onClick={handleOnFollowClick}
                        disabled={isButtonDisabled}
                        className={`px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white ${
                            isFollowed ? "bg-green-800" : "bg-gray-800"
                        } rounded-md`}>
                        {isLoading ? (
                            <BeatLoader size={8} color={"#ffffff"} />
                        ) : isFollowed ? (
                            "Following"
                        ) : (
                            "Follow"
                        )}
                    </button>
                )}
                {subjectSmartAccountAddress && smartAccountAddress && (
                    <GemsInfo
                        gemSubject={subjectSmartAccountAddress}
                        address={smartAccountAddress}
                    />
                )}
            </div>
            {/* <div className="bg-[#FF89A9] rounded-md text-[#2b2b2b] text-xs md:text-sm"> 
       <button
                className="py-2 px-3 flex items-center justify-between"
                onClick={openTradeDialog}
              >
                <FaGem />
                <div className="pl-2 font-medium text-base">BUY GEMS</div>
              </button> 
      {/* </div> */}
        </div>
    )
}
