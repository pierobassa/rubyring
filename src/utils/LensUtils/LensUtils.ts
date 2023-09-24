import { DEFUALT_USER_IMG_PLACEHOLDER } from "@/constants";
import { Profile } from "@lens-protocol/react-web";
import { FormattingUtils } from "..";

export const getProfilePicture = (profile?: Profile) => {
  if (!profile) return DEFUALT_USER_IMG_PLACEHOLDER;
  if (profile.picture?.__typename === "MediaSet") {
    const ipfsUrl = FormattingUtils.ipfsUriToHttps(
      profile.picture.original.url
    );
    return ipfsUrl ?? profile.picture.original.url;
  } else {
    return DEFUALT_USER_IMG_PLACEHOLDER;
  }
};
