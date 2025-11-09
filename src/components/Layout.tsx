import Navbar from "@/section/Navbar/Navbar";
import Sidebar from "@/section/Sidebar/Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main className="ml-[300px] mt-16 p-6 bg-[#ebeff4] min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
