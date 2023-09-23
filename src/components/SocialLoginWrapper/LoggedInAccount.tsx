import { AccountBox } from "@/components";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  address: string;
  onLogout: () => void;
};
export const LoggedInAccount: React.FC<Props> = ({ address, onLogout }) => {
  const handleLogout = () => {
    onLogout();
  };

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="relative flex rounded-md bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <AccountBox
            userImg={""} //TODO: Default placeholder user image
            userAddress={address}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-stone-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none cursor-pointer">
          <Menu.Item>
            {({ active }) => (
              <Link
                href={`/profile/${address}`}
                className={classNames(
                  active ? "text-[#FF89A9] bg-[#2b2b2b] rounded-md" : "",
                  "block px-4 py-2 text-sm text-white"
                )}
              >
                Profile
              </Link>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <a
                onClick={handleLogout}
                className={classNames(
                  active ? "text-[#FF89A9] bg-[#2b2b2b] rounded-md" : "",
                  "block px-4 py-2 text-sm text-white"
                )}
              >
                Log out
              </a>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
