"use client"

import { findOneReport } from "@/app/actions/reports";
import Navbar from "@/components/navbar";
import middlewareLogin from "@/security/middleware_login";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function ViewReport({ params }: { params: Promise<{ id: string }> })
{
    const [report, setReport] = useState<any>(null);
    const router = useRouter();

    middlewareLogin();
    
    useEffect(() =>
    {
        params.then((res) =>
        {
            const { id } = res;

            findOneReport(parseInt(id)).then((res) =>
            {
                setReport(res);
            });
        });
    }, []);

    return (
        <>
            <Navbar />
            
            <div className="max-w-6xl mx-auto mt-10 p-8 bg-card rounded-2xl shadow-md border border-border">

                <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
                    {
                        report &&

                        <>
                            <h1 className="text-3xl font-bold text-primary mb-6 text-center">
                                Rapport du{" "}
                                {new Date(report.createdAt).toLocaleDateString("fr-FR", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </h1>
                            
                            {
                                report.data.map((part: {tag: string, text: string}, index: number) =>
                                {
                                    switch (part.tag) {
                                        case "h1":
                                            return <h1 key={index} className="text-2xl font-semibold text-foreground mt-8 mb-4 border-l-4 border-primary pl-3">{part.text}</h1>
                                        case "h2":
                                            return <h2 key={index} className="text-xl font-medium text-foreground mt-6 mb-3 border-l-2 border-primary pl-3">{part.text}</h2>;
                                        default:
                                            return <p key={index} className="text-muted-foreground text-justify mb-4">{part.text}</p>;
                                    }
                                })
                            }

                            <button className="text-sm text-primary hover:text-primary/80 font-medium cursor-pointer" onClick={() => router.push("/dashboard")}>← Retour au dashboard</button>
                        </>
                    }

                    {
                        !report &&

                        <>Article introuvable</>
                    }
                </div>
            </div>
        </>
    )
}