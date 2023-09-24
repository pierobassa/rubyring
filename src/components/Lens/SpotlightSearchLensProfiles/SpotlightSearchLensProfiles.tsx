import { Fragment, useCallback, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SearchBar } from "@/components";
import {
  Profile,
  ProfileOwnedByMe,
  useFollow,
  useSearchProfiles,
  useUnfollow
} from "@lens-protocol/react-web";
import Image from "next/image";
import { FormattingUtils } from "@/utils";
import { BeatLoader } from "react-spinners";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: ProfileOwnedByMe;
};
export const SpotlightSearchLensProfilesDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  activeProfile
}) => {
  const [searchText, setSearchText] = useState<string>("");

  const handOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // TODO: handle loading
  const {
    data: searchProfiles
    //  loading
  } = useSearchProfiles({
    query: searchText
  });

  console.log({ searchProfiles });

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog onClose={onClose} className={"z-10"}>
        <div className="fixed inset-0 backdrop-blur-lg" aria-hidden="true" />
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
                {searchProfiles?.map((profile) => (
                  <SearchProfileResult
                    key={profile.handle}
                    profile={profile}
                    activeProfile={activeProfile}
                  />
                ))}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

type SearchProfileResultProps = {
  activeProfile: ProfileOwnedByMe;
  profile: Profile;
};

const SearchProfileResult: React.FC<SearchProfileResultProps> = ({
  activeProfile,
  profile
}) => {
  //TODO: handle errors
  const {
    execute: follow,
    // error: followError,
    isPending: followPending
  } = useFollow({
    followee: profile,
    follower: activeProfile
  });
  const {
    execute: unfollow,
    // error: unfollowError,
    isPending: unfollowPending
  } = useUnfollow({
    followee: profile,
    follower: activeProfile
  });

  const getProfilePicture = useCallback(() => {
    if (profile.picture?.__typename === "MediaSet") {
      const ipfsUrl = FormattingUtils.ipfsUriToHttps(
        profile.picture.original.url
      );
      return ipfsUrl ?? profile.picture.original.url;
    } else {
      return "https://via.placeholder.com/150";
    }
  }, [profile]);

  const isFollowed = profile.followStatus?.isFollowedByMe;
  const canFollow = profile.followStatus?.canFollow;
  const canUnfollow = profile.followStatus?.canUnfollow;
  const isButtonDisabled = !canFollow && !canUnfollow;
  const isLoading = followPending || unfollowPending;
  //TODO: handle error
  // const error = followError || unfollowError;

  const handleOnClick = useCallback(() => {
    if (isFollowed) {
      unfollow();
    } else {
      follow();
    }
  }, [isFollowed, follow, unfollow]);

  return (
    <div className="relative w-full flex items-center justify-between px-4 py-4 border-b border-gray-700">
      <div className="flex items-center">
        <Image
          width={12}
          height={12}
          className="w-12 h-12 rounded-full"
          src={getProfilePicture()}
          alt=""
        />
        <div className="ml-4">
          <div className="text-sm font-medium text-white">{profile.name}</div>
          <div className="text-sm text-gray-400">{profile.handle}</div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={handleOnClick}
          disabled={isButtonDisabled}
          className={`px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-white ${
            isFollowed ? "bg-green-800" : "bg-gray-800"
          } rounded-md`}
        >
          {isLoading ? (
            <BeatLoader size={8} color={"#ffffff"} />
          ) : isFollowed ? (
            "Following"
          ) : (
            "Follow"
          )}
        </button>
      </div>
    </div>
  );
};
