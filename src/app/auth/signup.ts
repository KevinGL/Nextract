"use server"

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const signup = async (supaUser: any, username: string, email: string, password: string) =>
{
    //const prisma = new PrismaClient();
                
    try
    {
        await prisma.user.upsert({
            where: { supabaseId: supaUser.id },
            update: {},
            create: {
                supabaseId: supaUser.id,
                username,
                email,
                password: await bcrypt.hash(password, 10),
                isAdmin: false
            },
        });

        return { success: true };
    }
    catch(err: any)
    {
        console.error("Erreur Prisma:", err);
        return { error: err.message || "Erreur serveur" };
    }
}