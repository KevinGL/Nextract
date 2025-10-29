"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import middlewareLogout from "@/security/middleware_logout";

export default function Login()
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const router = useRouter();
    const supabase = createClient();

    middlewareLogout();

    async function handleSubmit()
    {
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if(error)
        {
            setMessage(error.message);
            setShowModal(true);
        }
        else
        {
            router.push("/dashboard");
        }
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-md bg-white border border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Connexion à <span className="text-indigo-600">Nextract</span>
                </h1>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col text-left">
                        <label className="mb-1 text-sm font-medium text-gray-600">Email</label>
                        <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ex: utilisateur@nextract.io"
                        className="px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        />
                    </div>

                    <div className="flex flex-col text-left">
                        <label className="mb-1 text-sm font-medium text-gray-600">Mot de passe</label>
                        <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="px-4 py-2 rounded-md bg-gray-50 border border-gray-300 text-gray-800 outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full py-2.5 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        Se connecter
                    </button>
                </div>

                <p className="text-sm text-center text-gray-600 mt-5">
                    Pas encore de compte ?{" "}
                    <button
                        onClick={() => router.push("/signup")}
                        className="text-indigo-600 hover:text-indigo-800 font-medium underline-offset-2 hover:underline"
                    >
                        S'inscrire
                    </button>
                </p>

                {showModal &&
                    <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md text-sm text-center">
                        <p>Erreur lors de l'authentification : {message}</p>
                        <button
                        onClick={() => setShowModal(false)}
                        className="mt-2 text-red-600 underline hover:text-red-800 text-sm"
                        >
                        OK
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}