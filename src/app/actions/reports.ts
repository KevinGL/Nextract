"use server"

import { PrismaClient } from "@prisma/client";

export async function findAllReports()
{
    const prisma: PrismaClient = new PrismaClient();

    const reports: any[] = await prisma.report.findMany();

    const res: any[] = [];

    reports.map((report) =>
    {
        //console.log(JSON.parse(report.data).filter((item: any) => item.tag === "h1"));

        const parsed = JSON.parse(JSON.parse(report.data));
        const title = parsed.filter((item: any) => item.tag === "h1")[0];

        //console.log(title.text);
        
        res.push({ summary: report.summary, createdAt: report.createdAt, data: JSON.parse(report.data), title: title.text, id: report.id });
    });
    
    return res;
}

export async function findOneReport(id: number)
{
    const prisma: PrismaClient = new PrismaClient();

    const report = await prisma.report.findUnique({
        where: { id }
    });

    const parsed = report ? JSON.parse(JSON.parse(report.data)) : [];

    return { ...report, data: parsed };
}