import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IconContext } from "react-icons";
import { LuImagePlus } from "react-icons/lu";

type Props = {
  onImageDropped: (image: File) => void;
  _imageURL?: string;
};

export const ImageDropzone = ({ onImageDropped, _imageURL }: Props) => {
  const maxSize = 1048576;
  const [imageURL, setImageURL] = useState<string | undefined>(_imageURL);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageURL(URL.createObjectURL(file));
      setImageFile(file);
    }
    console.log(acceptedFiles);
  }, []);

  const { isDragActive, getRootProps, getInputProps, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [],
        "image/png": []
      },
      minSize: 0,
      maxSize
    });

  useEffect(() => {
    if (imageFile) {
      onImageDropped(imageFile);
    }
  }, [imageFile]);

  return (
    <div className="container text-center mt-5 justify-center w-full flex">
      <div
        {...getRootProps({ className: "dropzone" })}
        className="items-center flex flex-col justify-center cursor-pointer border rounded-lg border-dashed border-[#ff89a9] w-full"
      >
        <input {...getInputProps()} />
        {imageURL ? (
          <div className="image-container w-1/2">
            <img
              src={imageURL}
              alt="Uploaded Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        ) : (
          <div className="py-8">
            {!isDragActive && (
              <div className="flex flex-col justify-center items-center">
                <IconContext.Provider value={{ size: "26", color: "#FF89A9" }}>
                  <LuImagePlus />
                </IconContext.Provider>
                Click here or drop an image to upload!
              </div>
            )}
            {isDragActive && !isDragReject && "Drop it like it's hot!"}
            {isDragReject && "File type not accepted, sorry!"}
          </div>
        )}
      </div>
    </div>
  );
};
