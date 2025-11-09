import Layout from "@/components/Layout";
import { FaTachometerAlt } from "react-icons/fa";

export default function AdminPage() {
  return (
    <Layout>
      <div className="lg:ml-36">
        <div className="flex items-center">
          <FaTachometerAlt className="text-blue-600 text-2xl" />
          <h1 className="text-2xl font-bold text-gray-700">
            Dashboard Overview
          </h1>
        </div>
        <p className="mt-4 text-gray-600">This is the Admin page content.</p>
      </div>
    </Layout>
  );
}
