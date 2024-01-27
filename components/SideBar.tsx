import { siteConfig } from '@/config/site';
import { useAuth } from '@/providers/authProvider';
import {
  ArrowRightCircleIcon,
  Squares2X2Icon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {};

const SideBar = ({}: Props) => {
  const pathname = usePathname();
  const { accessToken, logout } = useAuth();

  const inActiveLink =
    'flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-xl';

  const activeLink = 'flex items-center p-3 text-white bg-blue-500 rounded-xl';
  return (
    <>
      {accessToken && (
        <nav className="w-56 flex flex-col  fixed left-0 bottom-0 top-0 h-screen py-8 px-4 max-w-xs bg-white overflow-auto z-50 dark:bg-gray-900 dark:border-gray-700">
          <div className="mb-6">
            <a className="inline-block mb-12 text-white"> Admin Dashboard</a>
            <ul>
              {siteConfig.sidebarItems.map((item) => (
                <li className="mb-4" key={item.href}>
                  <Link
                    href={item.href}
                    className={
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)
                        ? activeLink
                        : inActiveLink
                    }
                  >
                    <span>
                      <Squares2X2Icon className="text-sm font-semibold h-5 w-5" />
                    </span>
                    <span className="">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <span className="flex items-center p-4 text-gray-300 hover:bg-gray-800 rounded-xl">
              <span className="text-gray-400">
                <UserIcon className=" text-sm font-semibold h-5 w-5" />
              </span>
              <span className="">Account</span>
            </span>

            <Link href="">
              <span className="flex items-center p-4 text-gray-300 hover:bg-gray-800 rounded-xl">
                <span className="text-gray-400">
                  <ArrowRightCircleIcon className=" text-sm font-semibold h-5 w-5" />
                </span>
                <button className="">Log Out</button>
              </span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default SideBar;
