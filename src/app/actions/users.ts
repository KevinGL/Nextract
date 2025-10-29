"use server"

import { createClient } from "@/lib/supabaseServer";
import { PrismaClient } from "@prisma/client";

export default async function getCurrentUser()
{
    const supabase = createClient();

    const { data: { user }, error } = await (await supabase).auth.getUser();

    const prisma: PrismaClient = new PrismaClient();

    const currentUser = user ? await prisma.user.findUnique({where: { supabaseId: user.id }}) : null;

    return currentUser;
}