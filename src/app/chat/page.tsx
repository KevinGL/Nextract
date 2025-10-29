"use client"

import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react"
import { findAllReports } from "../actions/reports";
import middlewareLogin from "@/security/middleware_login";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import getCurrentUser from "../actions/users";
import chatAction from "../actions/chat";
import Navbar from "@/components/navbar";

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
            setUser(res.username);
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
            <Navbar />
            
            {
                reports.length === 0 &&

                <>Chargement ...</>
            }

            {
                reports.length > 0 &&

                <>
                    {
                        messages.map((message: Message, index: number) =>
                        {
                            return (
                                <Card key={index} className="border-border bg-card m-2">
                                    <p>{message.content}</p>
                                    <h1>{message.author}</h1>
                                </Card>
                            )
                        })
                    }

                    <Input type="textarea" className="bg-white" onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                    {
                        prompt.length > 0 &&

                        <button onClick={sendPrompt}>Envoyer</button>
                    }
                </>
            }
        </>
    )
}