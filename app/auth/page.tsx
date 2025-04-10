"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "../../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button"


export default function AuthPage() {
    const { signup, login, user, loading } = useAuth();
    const router = useRouter();

    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isSignup) {
                await signup(email, password);
                toast.success("Account created!", {
                    duration: 2000
                });
            } else {
                await login(email, password);
                toast.success("Logged in!", {
                    duration: 2000
                });
            }
        } catch (error: any) {
            toast.error(error.message, {
                duration: 2000
            });
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Logged in with Google!", {
                duration: 2000
            });
        } catch (error: any) {
            toast.error(error.message, {
                duration: 2000
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader size={40} color="#2563eb" />
            </div>
        );
    }

    return (
        <>
            <header className="w-full max-w-screen-2xl px-8 py-4 flex items-center justify-between z-20 bg-transparent bg-[radial-gradient(transparent_1px,#ffffff60_1px)] bg-[size:4px_4px] backdrop-blur-[6px] mask-[linear-gradient(rgb(0,0,0)_60%,rgba(0,0,0,0)_100%)]">
                <div className="flex items-center gap-2">
                    <div className="bg-primary rounded-full p-2">
                        {/* <Search className="h-5 w-5 text-primary-foreground" /> */}
                    </div>
                    <span className="font-bold text-xl">VFind</span>
                </div>

                <Button size="sm" onClick={() => router.push("/")}>
                    Home
                </Button>
            </header>
            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isSignup ? "Sign Up" : "Log In"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p>
                        {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                        <button
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-blue-600 underline"
                        >
                            {isSignup ? "Log In" : "Sign Up"}
                        </button>
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-center">
                    <div className="w-full border-t border-gray-300" />
                    <span className="mx-4 text-gray-500">or</span>
                    <div className="w-full border-t border-gray-300" />
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="mt-6 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 flex items-center justify-center gap-3 transition"
                >
                    <FcGoogle size={20} />
                    Continue with Google
                </button>
            </div>
        </>
    );
}
