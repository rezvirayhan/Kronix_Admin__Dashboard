import Layout from "@/components/Layout";
import { FaCommentDots } from "react-icons/fa";

export default function FeedbackPage() {
  return (
    <Layout>
      <div className="flex items-center gap-2">
        <FaCommentDots className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-700">Feedback Overview</h1>
      </div>
      <p className="mt-4 text-gray-600">This is the Feedback page content.</p>
    </Layout>
  );
}
