"use client";
import Link from "next/link";
import React from "react";

const TopBar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link href="/dashboard" className="btn btn-ghost text-xl">
          Voxance
        </Link>
      </div>
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/profile">Settings</Link>
            </li>
            <li>
              <Link href="/profile">Logout</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
