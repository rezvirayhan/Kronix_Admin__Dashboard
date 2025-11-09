import Layout from "@/components/Layout";
import { FaGamepad } from "react-icons/fa";

export default function GamePage() {
  return (
    <Layout>
      <div className="flex items-center gap-2">
        <FaGamepad className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-700">Game Overview</h1>
      </div>
      <p className="mt-4 text-gray-600">This is the Game page content.</p>
    </Layout>
  );
}
