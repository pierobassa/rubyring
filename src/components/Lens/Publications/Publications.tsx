import { AnyPublication } from "@lens-protocol/react-web";
import { LensPublication } from ".";
import { useCallback } from "react";

type Props = {
  publications: AnyPublication[];
  imageUrl: string;
  lensHandle: string;
};

export default function Publications({
  publications,
  imageUrl,
  lensHandle
}: Props) {
  //TODO: support mirror posts
  const getPublicationContent = useCallback((publication: AnyPublication) => {
    if (publication.__typename === "Post") {
      const content = publication.metadata.content ?? "";

      if (content.length > 100) {
        return `${content.substring(0, 100)}...`;
      }

      return content;
    }
    return "";
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 justify-between items-stretch flex-wrap">
      {!publications.length && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">No posts yet</div>
          <div className="text-lg font-medium">
            {lensHandle} has not posted anything yet
          </div>
        </div>
      )}
      {publications.map((publication) => (
        <div key={publication.id} className="w-full md:w-[30%]">
          <LensPublication
            content={getPublicationContent(publication)}
            imageUrl={imageUrl}
            lensHandle={lensHandle}
          />
        </div>
      ))}
    </div>
  );
}
