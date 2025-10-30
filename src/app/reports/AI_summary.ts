"use server"

import { GoogleGenAI } from "@google/genai";

export default async function AI_Summary(article: string)
{
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

    const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Fais un résumé fidèle en te basant uniquement sur le texte suivant, sans ajouter de faits extérieurs : \n\n${article}`
    });

    //console.log(res.text);

    return res.text;
}