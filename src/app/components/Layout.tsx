import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
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
        <ToastContainer
          position="bottom-right"
          autoClose={1500}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </main>
    </div>
  );
};

export default Layout;
