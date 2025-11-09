import Layout from "@/components/Layout";
import { FaTrophy } from "react-icons/fa";

export default function LeaderboardPage() {
  return (
    <Layout>
      <div className="flex items-center gap-2">
        <FaTrophy className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-700">
          Leaderboard Overview
        </h1>
      </div>
      <p className="mt-4 text-gray-600">
        This is the Leaderboard page content.
      </p>
    </Layout>
  );
}
