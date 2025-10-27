"use server"

import AI_Summary from "@/app/reports/AI_summary";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

interface ScrapingPart
{
    tag: string,
    text: string
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

    const title: string = $('h1.c-title').text().trim();
    const hat: string = $('p.c-chapo').text().trim();

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
        const text: string = $(el).text().trim();
        parts.push({ tag, text });
    });

    //console.log(parts);

    let content: string = "";

    parts.map((part: ScrapingPart) =>
    {
        content += part.text + "\n\n";
    });

    //console.log(content);

    const summary = await AI_Summary(content);

    return NextResponse.json({ summary });
}