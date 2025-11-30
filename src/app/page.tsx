"use client";

import { useRouter } from "next/navigation";
import Login from "./section/Login";

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
