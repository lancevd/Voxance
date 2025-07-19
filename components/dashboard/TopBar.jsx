"use client";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaBell, FaRocket, FaUserCircle } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import ThemeToggle from "../ThemeToggle";

const TopBar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);

  const { user, logout } = useAuth();

  const toggleUserDropdown = () => {
    setUserDropdownOpen((prev) => !prev);
  };

  const closeUserDropdown = () => {
    setUserDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdownOpen((prev) => !prev);
  };

  const closeNotificationDropdown = () => {
    setNotificationDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <Link href="/dashboard" className="flex mr-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Voxance
            </span>
          </Link>
        </div>
        <div className="flex items-center lg:order-2 space-x-4">
          {/* Theme toggle */}
          <ThemeToggle />
          {/* Notifications */}
          <div className="relative inline-block">
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={toggleNotificationDropdown}
            >
              <span className="sr-only">View notifications</span>
              <FaBell className="w-6 h-6" />
            </button>
            {notificationDropdownOpen && (
              <div className="absolute right-0 top-10 w-56 text-base bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-50">
                <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  Notifications
                </div>
                <div>
                  <Link
                    href="#"
                    onClick={closeNotificationDropdown}
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        New message from{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        : "Hey, what's up? All set for the presentation?"
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        a few moments ago
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
          {/* User Profile */}
          <div className="relative inline-block">
            <button
              type="button"
              className="flex cursor-pointer text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={toggleUserDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                src={user ? user.profilePicture : "/"}
                className="size-8 rounded-full"
                alt="User"
              />
            </button>
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 text-base bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-50">
                <div className="py-3 px-4">
                  <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                    {user ? user.firstName : "firstname"}{" "}
                    {user ? user.lastName : "lastname"}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {user?.status}
                  </span>
                </div>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <Link
                      href="#"
                      onClick={closeUserDropdown}
                      className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="flex items-center">
                        <FaUserCircle className="mr-2" />
                        My profile
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      onClick={closeUserDropdown}
                      className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                    >
                      <span className="flex items-center">
                        <FaGear className="mr-2" />
                        Account settings
                      </span>
                    </Link>
                  </li>
                </ul>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <Link
                      href="#"
                      onClick={closeUserDropdown}
                      className="flex justify-between items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <span className="flex items-center">
                        <FaRocket className="mr-2" />
                        Upgrade
                      </span>
                    </Link>
                  </li>
                </ul>
                <ul className="py-1 text-gray-500 dark:text-gray-400">
                  <li>
                    <Link
                      href=""
                      onClick={logout}
                      className="block py-2 px-4 text-sm text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 "
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
