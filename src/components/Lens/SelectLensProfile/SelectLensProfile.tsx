import { Profile, ProfileId } from "@lens-protocol/react-web";

type Props = {
  activeProfile?: Profile;
  profiles: Profile[];
  onChange: (profileId: ProfileId) => void;
};
export const SelectLensProfile: React.FC<Props> = ({
  activeProfile,
  profiles,
  onChange
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-2 items-start md:items-center">
      <p>Select a profile to use</p>
      <select
        className="px-1 py-2 bg-stone-600 border-gray-600 dark:placeholder-gray-400 text-white rounded-md"
        value={activeProfile?.id}
        onChange={(e) => onChange(e.target.value as ProfileId)}
      >
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.handle}
          </option>
        ))}
      </select>
    </div>
  );
};
