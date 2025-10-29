"use client"

import middlewareLogout from "@/security/middleware_logout";
import { useRouter } from "next/navigation";

export default function Home()
{
  const router = useRouter();

  middlewareLogout();

  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md tracking-tight">
        Nextract
      </h1>

      <p className="text-lg mb-10 max-w-md text-center">
        Analyse automatique et résumé quotidien de l'actualité.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-gray-100 transition hover:cursor-pointer"
        >
          S'authentifier
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-transparent border-2 border-white font-semibold rounded-full hover:bg-white/10 transition hover:cursor-pointer"
        >
          S'inscrire
        </button>
      </div>

      <footer className="text-sm pt-10">
        © {new Date().getFullYear()} Nextract — Tous droits réservés
      </footer>
    </div>
  );
}
