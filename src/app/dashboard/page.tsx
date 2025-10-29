"use client"

import Navbar from "@/components/navbar";
import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import middlewareLogin from "@/security/middleware_login";
import { findAllReports } from "../actions/reports";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Dashboard()
{
    const [user, setUser] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const supabase = createClient();
    const router = useRouter();

    middlewareLogin();

    useEffect(() =>
    {
        supabase.auth.getUser().then((res) =>
        {
            setUser(res.data.user);
            findAllReports().then((res) =>
            {
                const updatedReports = res.map((r: any) => ({
                    ...r,
                    showSummary: false,
                }));

                setReports(updatedReports);
            });
        });
    }, []);

    function toggleSummary(id: number)
    {
        const newReports = [...reports];

        newReports.map((r) =>
        {
            if(r.id === id)
            {
                r.showSummary = !r.showSummary
            }
        });

        setReports(newReports);
    }

    return (
        <div>
            <Navbar />

            {
                !user &&

                <div>Chargement ...</div>
            }

            {
                user &&

                <>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">Liste des rapports quotidiens</h1>

                    <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
                        {
                            reports.map((report: any, index: number) =>
                            {
                                return (
                                    <Card key={index} className="transition-all hover:shadow-lg hover:scale-[1.02] border-border bg-card m-2">
                                        <div className="p-5">
                                            <h2 className="text-lg font-medium text-primary mb-2">Rapport du {report.createdAt.toLocaleString("fr-FR", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </h2>

                                            <p className="text-sm text-muted-foreground line-clamp-3">{report.title}</p>

                                            <div className="flex justify-center mt-4">
                                                <Button onClick={() => toggleSummary(report.id)} className="cursor-pointer my-2">
                                                    {report.showSummary ? "Masquer le résumé" : "Afficher le résumé"}
                                                </Button>
                                            </div>
                                            
                                            {
                                                report.showSummary &&
                                                
                                                <p className="text-sm text-muted-foreground">{report.summary}</p>
                                            }

                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer"
                                                    onClick={() => router.push(`/reports/${report.id}`)}
                                                >
                                                    Voir l'article complet →
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })
                        }
                    </div>
                </>
            }
        </div>
    )
}