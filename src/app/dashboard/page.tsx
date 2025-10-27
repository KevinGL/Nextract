"use client"

import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import middlewareLogin from "@/security/middleware_login";

export default function Dashboard()
{
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    middlewareLogin();

    useEffect(() =>
    {
        supabase.auth.getUser().then((res) =>
        {
            setUser(res.data.user);
        });
    }, []);

    return (
        <div>
            <Navbar />
            {
                !user &&

                <div>Chargement ...</div>
            }
        </div>
    )
}