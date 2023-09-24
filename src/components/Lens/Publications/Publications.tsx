import { AnyPublication } from "@lens-protocol/react-web";
import { LensPublication } from ".";
import { useCallback } from "react";
import { BaseSeparator } from "@/components";

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
      {!publications.length ? (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="text-2xl font-bold">No posts yet</div>
          <div className="text-lg font-medium text-gray-500">
            {lensHandle} has not posted anything yet
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col  justify-center gap-2">
          <BaseSeparator className="w-full h-0.5 bg-stone-500" />
          <div className="text-lg font-medium text-gray-500">
            {publications.length} posts
          </div>

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
      )}
    </div>
  );
}
