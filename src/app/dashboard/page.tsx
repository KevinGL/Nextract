"use client"

import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import middlewareLogin from "@/security/middleware_login";
import * as cheerio from "cheerio";
import scraping from "../reports/scraping";

export default function Dashboard()
{
    const [user, setUser] = useState<any>(null);
    const [summary, setSummery] = useState<any>(null);
    const supabase = createClient();

    middlewareLogin();

    useEffect(() =>
    {
        supabase.auth.getUser().then((res) =>
        {
            setUser(res.data.user);
            scraping();
        });
    }, []);

    return (
        <div>
            <Navbar />
            {
                !user &&

                <div>Chargement ...</div>
            }

            {
                user &&

                <div>Liste des scrapings</div>
            }
        </div>
    )
}