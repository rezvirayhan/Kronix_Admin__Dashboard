"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { CiText } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { VscPreview } from "react-icons/vsc";
import { BsPostageFill } from "react-icons/bs";

import {
  MdCategory,
  MdOutlineLibraryBooks,
  MdPhotoLibrary,
  MdPriceChange,
} from "react-icons/md";
import Logout from "../SignIn/Logout";
import { IoIosNotifications } from "react-icons/io";

interface SidebarItemProps {
  name: string;
  icon: ReactNode;
  route: string;
}

const SidebarItem = ({ name, icon, route }: SidebarItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === route;

  return (
    <li
      onClick={() => router.push(route)}
      className={`flex items-center gap-3 px-3 py-2  cursor-pointer transition ${
        isActive
          ? "bg-[#d1d5db] text-[#00b0ea]"
          : "text-[#809bb5] hover:bg-gray-100 "
      }`}
    >
      {icon} <span>{name}</span>
    </li>
  );
};

const Sidebar = () => {
  const items: SidebarItemProps[] = [
    {
      name: "Admin",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <FaUserTie />
        </span>
      ),
      route: "/dashboard/admin",
    },
    {
      name: "Banner",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <MdPriceChange />
        </span>
      ),
      route: "/dashboard/banner",
    },
    {
      name: "Hero",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <BsPostageFill />
        </span>
      ),
      route: "/dashboard/hero",
    },
    {
      name: "Testimonial",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <VscPreview />
        </span>
      ),
      route: "/dashboard/testimonial",
    },
    {
      name: "Portfolio",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <MdPhotoLibrary />
        </span>
      ),
      route: "/dashboard/portfolio",
    },
    {
      name: "Category",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <MdCategory />
        </span>
      ),
      route: "/dashboard/category",
    },
    {
      name: "Messages",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <CiText />
        </span>
      ),
      route: "/dashboard/messages",
    },
    {
      name: "Notifications ",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <IoIosNotifications />
        </span>
      ),
      route: "/dashboard/notifications",
    },
    {
      name: "Pricing",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <MdPriceChange />
        </span>
      ),
      route: "/dashboard/pricing",
    },
    {
      name: "Blogs",
      icon: (
        <span className="text-2xl text-white  bg-[#00b0ea] px-1 py-1 rounded-md">
          <MdOutlineLibraryBooks />
        </span>
      ),
      route: "/dashboard/blogs",
    },
  ];
  return (
    <aside className="fixed top-20 left-0 w-70 h-[calc(95vh-4rem)] bg-white text-white flex flex-col justify-between ml-5 mt-5">
      <ul className="space-y-2">
        {items.map((item) => (
          <SidebarItem key={item.name} {...item} />
        ))}
      </ul>

      <Logout
        className="px-4 py-2 mt-3 bg-[#02a6dd] text-white rounded w-11/12 font-semibold cursor-pointer text-[14px] hover:bg-[#028fcf] transition"
        redirectTo="/"
      >
        Logout
      </Logout>
    </aside>
  );
};

export default Sidebar;
