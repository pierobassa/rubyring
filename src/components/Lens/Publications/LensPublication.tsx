import { FaGem } from "react-icons/fa";

type Props = {
  content: string;
  imageUrl: string;
  lensHandle: string;
};

export const LensPublication = ({ content, imageUrl, lensHandle }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center  border-b rounded-lg  md:rounded-tl-lg md:border-r bg-stone-800 border-stone-700">
      <FaGem className="text-[#fe87a2] text-2xl" />
      <blockquote className="max-w-2xl mx-auto mb-4 00 lg:mb-8 text-gray-400">
        <p className="my-4">{content}</p>
      </blockquote>
      <div className="flex items-center justify-center space-x-3">
        <img
          className="rounded-full w-9 h-9"
          src={imageUrl}
          alt="profile picture"
        />
        <div className="space-y-0.5 font-medium text-white text-left">
          <div>{lensHandle}</div>
          <div className="text-sm  text-gray-400">Early user of Ruby Ring</div>
        </div>
      </div>
    </div>
  );
};
