"use server"

import { GoogleGenAI } from "@google/genai";

interface Message
{
    author: string;
    content: string
}

export default async function chatAction(messages: Message[], reports: any[]): Promise<Message[]>
{
    let partReports: string = "";

    reports.map((report) =>
    {
        partReports += "Rapport du " +
        (new Date(report.createdAt).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })) + "\n" +
        report.summary + "\n\n";
    });
    
    let chatHistory: any[] = [];

    messages.map((message: Message, index: number) =>
    {
        let role: string = "user";

        if(message.author === "Nextract IA")
        {
            role = "model";
        }

        chatHistory.push({
            role,
            parts: [{
                text: index == 0 ? partReports + message.content : message.content
            }]
        });
    });

    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: chatHistory
    });

    let updatedMessages = messages;
    updatedMessages.push({author: "Nextract IA", content: res.text as string});

    return [...updatedMessages];
}