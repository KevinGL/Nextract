

import AI_Summary from "@/app/reports/AI_summary";
import { PrismaClient } from "@prisma/client";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ScrapingPart
{
    tag: string,
    text: string
}

function cleanText(text: string): string
{
  return text
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/•/g, "")
    .trim();
}

export async function GET()
{
    const uri: string = "https://www.franceinfo.fr";
    
    let res = await fetch(uri);
    let html = await res.text();
    let $ = cheerio.load(html);

    const link = uri + $('article.card-article-majeure a').attr("href");

    res = await fetch(link);
    html = await res.text();
    $ = cheerio.load(html);

    const title: string = cleanText($('h1.c-title').text());
    const hat: string = cleanText($('p.c-chapo').text());

    const parts: ScrapingPart[] = [];

    parts.push({
        tag: "h1",
        text: title
    });

    parts.push({
        tag: "p",
        text: hat
    });
    
    $('div.c-body h2, div.c-body p').each((_, el) =>
    {
        const tag: string = el.tagName;
        const text: string = cleanText($(el).text());
        parts.push({ tag, text });
    });

    //console.log(parts);

    let content: string = "";

    parts.map((part: ScrapingPart) =>
    {
        content += part.text + "\n\n";
    });

    const summary = await AI_Summary(content);

    const prisma = new PrismaClient();
    
    try
    {
        await prisma.report.create({
            data: {
                createdAt: new Date(),
                data: JSON.stringify(parts),
                summary: summary ?? "Aucun résumé disponible"
            },
        });

        return NextResponse.json({ success: true, summary }, { status: 200 });
    }
    catch(err: any)
    {
        console.error("Erreur Prisma:", err);
        return NextResponse.json({ success: false, error: err.message || "Erreur serveur" }, { status: 500 });
    }
}