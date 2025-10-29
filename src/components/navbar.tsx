"use client"

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Navbar()
{
    const supabase = createClient();
    const router = useRouter();

    const signout = async () =>
    {
        await supabase.auth.signOut();
        router.push("/");
    }

    return (
        <div className="fixed top-0 left-0 w-full h-[80px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg backdrop-blur-md z-50">
            <div className="max-w-6xl mx-auto h-full flex justify-between items-center px-6">
                <h1 
                    className="text-2xl font-bold text-white tracking-tight cursor-pointer"
                    onClick={() => router.push("/dashboard")}
                    >
                    Nextract
                </h1>

                <nav className="flex items-center space-x-4">
                    <button
                        className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition hover:cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    >
                        Dashboard
                    </button>
                <button
                    className="px-4 py-2 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition hover:cursor-pointer"
                    onClick={() => router.push("/chat")}
                >
                    Chat IA
                </button>
                    <button
                        className="ml-2 px-4 py-2 rounded-lg bg-white text-indigo-600 font-medium hover:bg-gray-100 transition hover:cursor-pointer"
                        onClick={signout}
                    >
                        Déconnexion
                    </button>
                </nav>
            </div>
        </div>
    )
}