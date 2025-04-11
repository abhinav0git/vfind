"use client";

import { useAuth } from "../../lib/authContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function DashboardPage() {

  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      alert("Logout failed: " + error.message);
      toast.error("Logout failed :" + error.message);
    } finally {
      toast.success("Logged out!", {
        duration: 2000
      });
    }
  };

  return (
    <ProtectedRoute>
      <header className="w-full max-w-screen-2xl px-8 py-4 fixed flex items-center justify-between z-20 bg-transparent bg-[radial-gradient(transparent_1px,#ffffff60_1px)] bg-[size:4px_4px] backdrop-blur-[6px] mask-[linear-gradient(rgb(0,0,0)_60%,rgba(0,0,0,0)_100%)]">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            {/* <Search className="h-5 w-5 text-primary-foreground" /> */}
          </div>
          <span className="font-bold text-xl">VFind</span>
        </div>

        <Button
          size="sm"
          onClick={() => router.push("/")}
        >
          Home</Button>
      </header>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-bold mb-4 justify-center">Welcome, {user?.email}</h1>
        <Button
          onClick={handleLogout}
          variant="destructive"
        >
          Logout
        </Button>
      </div>
    </ProtectedRoute>
  );
}
