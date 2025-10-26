"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function Login()
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent)
    {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setMessage(error ? error.message : "Authentification réussie");
        setShowModal(true);
    }
    
    return (
        <div>
            <div>
                <label htmlFor="">email</label>
                <input type="email" required onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="">password</label>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} />

                <div onClick={(e) => handleSubmit(e)}>Se connecter</div>
            </div>

            {
                showModal &&
                <div>
                    <p>Erreur lors de l'Authentification : {message}</p>
                    <button onClick={() => setShowModal(false)}>OK</button>
                </div>
            }
        </div>
    )
}