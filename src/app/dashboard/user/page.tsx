import Layout from "@/components/Layout";
import { FaUsers } from "react-icons/fa";

export default function UserPage() {
  return (
    <Layout>
      <div className="flex items-center gap-2">
        <FaUsers className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-700">User Overview</h1>
      </div>
      <p className="mt-4 text-gray-600">This is the User page content.</p>
    </Layout>
  );
}
