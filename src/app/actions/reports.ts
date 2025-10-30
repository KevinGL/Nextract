"use server"

import { decrypt, encrypt } from "@/security/crypto";
import { PrismaClient } from "@prisma/client";

function parseMaybeJSON(input: unknown)
{
    if (typeof input === "object" && input !== null) return input;

    if (typeof input === "string")
    {
        try
        {
            const once = JSON.parse(input);

            if(typeof once === "string")
            {
                try
                {
                    return JSON.parse(once);
                }
                catch
                {
                    return once; // c'était juste une string normale
                }
            }
            return once; // objet/array
        }
        catch
        {
            // Pas du JSON, on renvoie la string brute
        return input;
        }
    }

  // Autres types (null/undefined/number/bool) : renvoie tel quel
  return input;
}

export async function findAllReports()
{
    const prisma: PrismaClient = new PrismaClient();

    const reports: any[] = await prisma.report.findMany();

    const res: any[] = [];

    reports.map((report) =>
    {
        //console.log(JSON.parse(report.data).filter((item: any) => item.tag === "h1"));

        const parsed = parseMaybeJSON(report.data);
        const title = parsed.filter((item: any) => item.tag === "h1")[0];

        //console.log(title.text);
        
        res.push({ summary: report.summary, createdAt: report.createdAt, data: JSON.parse(report.data), title: title.text, id: encrypt(report.id.toString()) });
    });
    
    return res;
}

export async function findOneReport(id: string)
{
    const prisma: PrismaClient = new PrismaClient();

    const report = await prisma.report.findUnique({
        where: { id: parseInt(decrypt(id)) }
    });

    const parsed = report ? parseMaybeJSON(report.data) : [];

    return { ...report, data: parsed };
}