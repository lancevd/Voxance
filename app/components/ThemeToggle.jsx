"use client";

import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load theme from localStorage or system preference
    // const storedTheme = localStorage.getItem("theme") || "light";
    // setTheme(storedTheme);
    // document.documentElement.classList.toggle("dark", storedTheme === "dark");

    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) )
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("color-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition "
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaMoon className="w-5 h-5 text-gray-900" />
      ) : (
        <FaSun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
