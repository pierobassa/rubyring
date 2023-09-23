import { useCreateProfile } from "@lens-protocol/react-web";
import React, { useCallback } from "react";

type Props = {
  displayLabel?: boolean;
};
export const CreateLensProfileForm: React.FC<Props> = ({
  displayLabel = false
}) => {
  //TODO: handle loading
  const {
    execute: createProfile,
    // isPending: isCreateProfilePending,
    error: createProfileError
  } = useCreateProfile();

  const onCreateSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //TODO
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = (e.target as any).elements["create-handle"].value;
      console.log("creating profile", handle);
      try {
        await createProfile({ handle });
      } catch (error) {
        console.error("create profile failed", error);
      }
    },
    [createProfile]
  );

  return (
    <form
      className="flex flex-col gap-2 w-full items-center justify-between"
      onSubmit={onCreateSubmit}
    >
      <div className="flex flex-col gap-2 items-start justify-start flex-grow w-full">
        {displayLabel && (
          <label htmlFor="create-handle" className="">
            Create handle
          </label>
        )}
        <input
          type="text"
          id="create-handle"
          className="block w-full px-4 py-2 text-sm  border  rounded-lg ring-transparent bg-stone-600 border-gray-600 dark:placeholder-gray-400 text-white"
          placeholder="Handle name"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md w-1/2"
      >
        Create
      </button>
      {createProfileError && (
        <p className="text-red-500">{createProfileError.message}</p>
      )}
    </form>
  );
};
