import { useState } from "react";
import {
  APPALACHIAN_TRAIL,
  BLUE_RIDGE_PARKWAY,
  CONTINENTAL_DIVIDE_TRAIL,
} from "../constants";
import { PathSlug } from "../types";

const navigationPaths = [
  {
    title: APPALACHIAN_TRAIL,
    href: `/${PathSlug.AppalachianTrail}`,
  },
  {
    title: BLUE_RIDGE_PARKWAY,
    href: `/${PathSlug.BlueRidgeParkway}`,
  },
  {
    title: CONTINENTAL_DIVIDE_TRAIL,
    href: `/${PathSlug.ContinentalDivideTrail}`,
  },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <a
              href="/"
              className="flex items-center text-2xl font-extrabold leading-none text-green-600 select-none"
            >
              every mile<span className="text-green-800">.</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationPaths.map(({ title, href }) => (
              <a
                key={href}
                href={href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-150 ease-out"
              >
                {title}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {navigationPaths.map(({ title, href }) => (
              <a
                key={href}
                href={href}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-out"
                onClick={() => setIsOpen(false)}
              >
                {title}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
