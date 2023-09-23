"use client";
import { useCallback, useState } from "react";

import Link from "next/link";
import { IconContext } from "react-icons";
import { FaGem, FaBars, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import dynamic from "next/dynamic";

const SocialLoginWrapper = dynamic(
  () =>
    import("@/components/SocialLoginWrapper").then(
      (res) => res.SocialLoginWrapper
    ),
  {
    ssr: false
  }
);
export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setOpen(!open);
  }, [open]);

  // TODO: Open navbar and focus on search bar
  const onSearchClick = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <div className="bg-[#2b2b2b]">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={toggleOpen}
            >
              {open ? (
                <FaX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FaBars className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <button
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onSearchClick}
            >
              <FaMagnifyingGlass className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/">
                {/* <Image WE CAN SHOW AN IMAGE LOGO TOO
                                    className="h-8 w-auto"
                                    src={Logo}
                                    alt="Your Company"
                                /> */}
                <IconContext.Provider value={{ size: "32", color: "#FF89A9" }}>
                  <FaGem />
                </IconContext.Provider>
              </Link>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Profile dropdown */}
            <SocialLoginWrapper />
          </div>
        </div>
      </div>

      {open && (
        <div className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* UNCOMMENT TO SHOW NAVIGATION ITEMS */}
            {/*  {navigation.map(item => (
                            <a
                  0              key={item.name}
                                href={item.href}
                                className={classNames(
                                    item.current
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                    "block rounded-md px-3 py-2 text-base font-medium",
                                )}
                                aria-current={
                                    item.current ? "page" : undefined
                                }>
                                {item.name}
                            </a>
                        ))} */}
          </div>
        </div>
      )}
    </div>
  );
};
