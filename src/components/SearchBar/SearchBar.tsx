"use client";

import { HTMLAttributes } from "react";

type Props = {
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  containerClassName?: HTMLAttributes<HTMLDivElement>["className"];
  inputClassName?: HTMLAttributes<HTMLInputElement>["className"];
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
export const SearchBar: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  containerClassName,
  inputClassName,
  ...otherProps
}) => {
  return (
    <div className={`relative ${containerClassName}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-stone-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        id="default-search"
        className={`block w-full p-3 pl-10 text-sm border rounded-lg ring-transparent bg-stone-600 border-gray-600 dark:placeholder-gray-400 text-white ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        {...otherProps}
      />
    </div>
  );
};
