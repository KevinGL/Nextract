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
        <div>
            <button onClick={signout}>Déconnexion</button>
        </div>
    )
}