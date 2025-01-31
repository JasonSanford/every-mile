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
  return (
    <section className="relative w-full px-8 text-gray-700 bg-white body-font">
      <div className="container flex flex-col flex-wrap items-center justify-between py-5 mx-auto md:flex-row max-w-7xl">
        <a
          href="/"
          className="relative z-10 flex items-center w-auto text-2xl font-extrabold leading-none text-green-600 select-none"
        >
          every mile<span className="text-green-800">.</span>
        </a>
        <nav className="top-0 left-0 z-0 flex items-center justify-center w-full h-full py-5 -ml-0 space-x-5 text-base md:-ml-5 md:py-0 md:absolute">
          {navigationPaths.map(({ title, href }) => (
            <a
              key={href}
              href={href}
              className="relative font-medium leading-6 text-gray-600 transition duration-150 ease-out hover:text-gray-900"
            >
              <span className="block">{title}</span>
            </a>
          ))}
        </nav>

        {/* <div className="relative z-10 inline-flex items-center space-x-3 md:ml-5 lg:justify-end">
          <a href="#" className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none">
            Sign in
          </a>
          <span className="inline-flex rounded-md shadow-sm">
            <a href="#" className="inline-flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-blue-600 border border-blue-700 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Sign up
            </a>
          </span>
        </div> */}
      </div>
    </section>
  );
};

export default Navigation;
