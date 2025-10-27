"use client"

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function middlewareLogout()
{
    const supabase = createClient();
    const router = useRouter();

    useEffect(() =>
    {
        supabase.auth.getUser().then((res) =>
        {
            if(res.data.user)
            {
                router.push("/dashboard");
            }
        });
    }, []);
}