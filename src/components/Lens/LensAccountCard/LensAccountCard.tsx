import { CreateLensProfileForm, SelectLensProfile } from "@/components";
import { BeatLoader } from "react-spinners";
import {
  useActiveProfile,
  useActiveProfileSwitch,
  useProfilesOwnedByMe
} from "@lens-protocol/react-web";

export default function LensAccountCard() {
  const {
    data: activeProfile,
    error: activeProfileError,
    loading: activeProfileLoading
  } = useActiveProfile();

  //TODO: handle loading
  const {
    execute: switchActiveProfile
    // isPending: swtichActiveProfilePending
  } = useActiveProfileSwitch();

  //TODO: handle pagination
  const {
    data: profiles,
    loading: profilesOwnedLoading
    // hasMore,
    // next
  } = useProfilesOwnedByMe({
    limit: 10
  });

  const isLoading = activeProfileLoading || profilesOwnedLoading;

  if (isLoading) return <BeatLoader className="w-8 h-8" />;

  if (!activeProfile && profiles?.length === 0) {
    return (
      <div className="w-full px-4 py-8 bg-[#2b2b2b] rounded-md self-center flex flex-col gap-8 items-start justify-start">
        <div className="flex flex-col gap-0 items-center justify-start text-center w-full">
          <h1 className="text-2xl font-bold">
            No handles found for this account
          </h1>
          <h3 className="text-sm text-gray-300">
            Start today by creating a new one
          </h3>
        </div>
        <div className="w-full md:w-1/2 self-center">
          <CreateLensProfileForm />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 bg-[#2b2b2b] rounded-md self-center flex flex-col gap-2 items-start justify-start w-full">
      {activeProfileLoading && <p>Loading...</p>}
      {activeProfileError && <p>Error: {activeProfileError.message}</p>}
      {activeProfile === null && <p>No active profile</p>}
      {profilesOwnedLoading && <p>Loading profiles...</p>}
      <SelectLensProfile
        activeProfile={activeProfile ?? undefined}
        profiles={profiles ?? []}
        onChange={switchActiveProfile}
      />
      <CreateLensProfileForm displayLabel={true} />
    </div>
  );
}
