"use client"

import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react"
import { findAllReports } from "../actions/reports";
import middlewareLogin from "@/security/middleware_login";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import getCurrentUser from "../actions/users";
import chatAction from "../actions/chat";

interface Message
{
    author: string;
    content: string
}

export default function Chat()
{
    const [user, setUser] = useState<string>("");
    const [reports, setReports] = useState<any[]>([]);
    const [prompt, setPrompt] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    middlewareLogin();
    
    useEffect(() =>
    {
        getCurrentUser().then((res) =>
        {
            setUser(res ? res.username : "Unknown");
        });
            
        findAllReports().then((res) =>
        {
            setReports(res);
        });
    }, []);

    useEffect(() =>
    {
        setPrompt("");
    }, [user]);

    const sendPrompt = async () =>
    {
        const updatedMessages = messages;
        updatedMessages.push({author: user, content: prompt});
        setMessages(updatedMessages);
        
        setPrompt("");

        setMessages(await chatAction(messages, reports));
    }

    return (
        <>
            {
                reports.length === 0 &&

                <>Chargement ...</>
            }

            {
                reports.length > 0 &&

                <>
                    <div className="flex flex-col">
                        {
                            messages.map((message: Message, index: number) =>
                            {
                                return (
                                    <div key={index} className={`flex w-full my-2 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                                        <Card
                                            className={`
                                                max-w-[60%] px-4 py-2 rounded-2xl
                                                ${index % 2 === 0 
                                                ? "bg-blue-500 text-white rounded-br-none" 
                                                : "bg-gray-200 text-black rounded-bl-none"}
                                            `}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                            <p className="text-xs mt-1">{message.author}</p>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div>
                        <div className="max-w-3xl mx-auto flex items-center gap-2 p-4">
                            <div className="relative flex-1">
                                <Input
                                    type="text"
                                    placeholder="Écris ton message..."
                                    className="w-full pr-12 bg-muted/50 border-border rounded-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <button
                                    onClick={sendPrompt}
                                    disabled={!prompt.trim()}
                                    className={`
                                        absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full text-sm font-medium
                                        ${prompt.trim()
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"}
                                        transition-all
                                    `}
                                >
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}