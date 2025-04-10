"use client";

import { useAuth } from "../lib/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth"); // redirect if not logged in
        }
    }, [user, loading]);

    if (loading || !user) {
        return <p>Loading...</p>;
    }

    return <>{children}</>;
}