"use client";

import Login from "@/app/section/SignIn/Login";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/dashboard/admin");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ebeff4]">
      <Login onLogin={handleLogin} />
    </div>
  );
}
