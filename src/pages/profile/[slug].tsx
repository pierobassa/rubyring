"use client";
import { useRouter } from "next/router";
import { useActiveProfile, useProfile } from "@lens-protocol/react-web";
import { WithLensContext } from "@/providers";
import { LensProfileCard } from "@/components/Lens/LensProfileCard";

const Profile = () => <WithLensContext Component={<ProfileComponent />} />;
export default Profile;

const ProfileComponent = () => {
  const router = useRouter();

  // Address of the smart account of the given Lens profile

  const profileHandle = router.query.slug as string;

  //TODO: handle loading state
  const {
    data: profile
    // loading
  } = useProfile({
    handle: profileHandle ?? ""
  });

  const { data: activeProfile } = useActiveProfile();

  console.log({ profile });

  // I need to resolve the smart account address of the given Lens profile from the BE
  // const getSmartAccountAddress = useCallback(async () => {
  //   const { data, status } = await axios.get(
  //     RubyRingAPI.GET_RING_DATA_ENDPOINT(profileHandle)
  //   );

  //   if (status !== 200) return; //TODO

  //   console.log(data);

  //   setProfileSmartAccountAddress(data.data[0].smart_account_address);
  // }, [profileHandle]);

  // Fetch the smart account address of the given Lens profile
  // useEffect(() => {
  //   if (profileSmartAccountAddress) return;

  //   getSmartAccountAddress();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  if (!profile || !activeProfile)
    return <h1 className="font-bold text2xl">Profile not found</h1>;

  return (
    <LensProfileCard
      cardClassName="max-w-5xl px-4 mx-auto bg-[#2b2b2b] rounded-md p-4 mt-8 "
      profile={profile}
      activeProfile={activeProfile}
      renderFollowButton={true}
    />
  );
};
