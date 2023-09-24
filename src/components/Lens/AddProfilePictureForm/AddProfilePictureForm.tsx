import { ImageDropzone } from "@/components";
import { useUpdateProfileImage } from "@lens-protocol/react-web";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from "react";
import { web3StorageClient } from "@/networking";
import { FaGem } from "react-icons/fa";
import { getWeb3StorageLink } from "../CreateLensProfileForm/helpers";
import { Loader } from "@/components/Loader";
import { useAccountStore } from "@/store";
import toast from "react-hot-toast";

type Props = {
  setStep: Dispatch<SetStateAction<number>>;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AddProfilePictureForm({ setStep }: Props) {
  const [userImage, setUserImage] = useState<File>();

  const [loading, setLoading] = useState<boolean>(false);

  //TODO: we hsould get rid of this as it should be outdated
  const { lensAccount } = useAccountStore();

  const {
    execute: updateLensProfilePic
    // error,
    // isPending
  } = useUpdateProfileImage({
    profile: lensAccount!
  });

  const uploadImage = useCallback(async () => {
    if (!userImage) return;

    const cid = await web3StorageClient.put([userImage]);

    console.log("stored files with cid:", cid);

    return cid;
  }, [userImage]);

  const onCreateSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setLoading(true);

        if (!lensAccount) throw new Error("lens account not found");

        const cid = await uploadImage();

        if (!cid) throw new Error("failed to upload image");

        const web3StorageIPFSurl = getWeb3StorageLink(cid);

        const imageURL = `${web3StorageIPFSurl}/${userImage?.name}`;

        await updateLensProfilePic(imageURL);

        setLoading(false);

        setStep((prev) => prev + 2);
      } catch (error) {
        toast.error("Oops! Something went wrong. Please try again.");

        setLoading(false);
      }
    },
    [lensAccount, setStep, updateLensProfilePic, uploadImage, userImage?.name]
  );

  const isSubmitDisabled = useMemo(() => {
    return !userImage;
  }, [userImage]);

  const imageURL = useMemo(() => {
    if (!userImage) return;

    return URL.createObjectURL(userImage);
  }, [userImage]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center w-full h-[40vh]">
        <Loader />
      </div>
    );

  return (
    <form
      className="flex flex-col w-full items-center justify-between"
      onSubmit={onCreateSubmit}
    >
      <ImageDropzone
        onImageDropped={(image: File) => setUserImage(image)}
        _imageURL={imageURL}
      />
      <button
        className={classNames(
          "bg-[#FF89A9] flex justify-center items-center  rounded-md text-[#2b2b2b] w-full mt-8",
          isSubmitDisabled
            ? "cursor-not-allowed brightness-75"
            : " hover:brightness-90"
        )}
        disabled={isSubmitDisabled}
      >
        <p className="py-2 px-2 font-medium uppercase text-base">
          Join Ruby Ring
        </p>
        <FaGem />
      </button>
    </form>
  );
}
