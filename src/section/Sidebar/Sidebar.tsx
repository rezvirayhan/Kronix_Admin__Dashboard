"use client";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FaSignOutAlt } from "react-icons/fa";

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
          ? "bg-[#d1d5db] text-[#019ee2]"
          : "text-[#809bb5] hover:bg-gray-100"
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
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/admin",
    },
    {
      name: "Banner",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/banner",
    },
    {
      name: "Hero",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/hero",
    },
    {
      name: "Testimonial",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/testimonial",
    },
    {
      name: "Portfolio",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/portfolio",
    },
    {
      name: "Category",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/category",
    },
    {
      name: "Messages",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/messages",
    },
    {
      name: "Pricing",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/pricing",
    },
    {
      name: "Blogs",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/blogs",
    },
    {
      name: "Game",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/game",
    },
    {
      name: "Leaderboard",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/leaderboard",
    },
    {
      name: "Feedback",
      icon: <span className="text-lg">icon</span>,
      route: "/dashboard/feedback",
    },
  ];

  return (
    <aside className="fixed top-20 left-0 w-70 h-[calc(100vh-4rem)] bg-white text-white flex flex-col justify-between ml-5 mt-5">
      <ul className="space-y-2">
        {items.map((item) => (
          <SidebarItem key={item.name} {...item} />
        ))}
      </ul>

      <button className="flex items-center gap-2 text-red-400 hover:text-red-600 px-3 py-2 rounded-lg transition">
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
