"use client";

import Login from "@/section/SignIn/Login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Login onLogin={handleLogin} />
    </div>
  );
}
