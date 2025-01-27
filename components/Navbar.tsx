"use client"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const getActiveClass = (path: string) => {
    return pathname === path
      ? "text-blue-400"
      : "text-gray-300 hover:text-blue-400";
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">CrowdFund</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`${getActiveClass(
                "/"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Home
            </Link>
            <Link
              href="/campaigns"
              className={`${getActiveClass(
                "/campaigns"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Campaigns
            </Link>
            <Link
              href="/create"
              className={`${getActiveClass(
                "/create"
              )} transition-colors duration-200 text-sm font-medium`}
            >
              Start Campaign
            </Link>
          </div>

          {/* Connect Wallet Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`${getActiveClass(
              "/"
            )} block px-3 py-2 rounded-md text-base font-medium`}
          >
            Home
          </Link>
          <Link
            href="/campaigns"
            className={`${getActiveClass(
              "/campaigns"
            )} block px-3 py-2 rounded-md text-base font-medium`}
          >
            Campaigns
          </Link>
          <Link
            href="/create"
            className={`${getActiveClass(
              "/create"
            )} block px-3 py-2 rounded-md text-base font-medium`}
          >
            Start Campaign
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
