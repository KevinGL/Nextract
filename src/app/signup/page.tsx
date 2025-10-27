"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { signup } from "../auth/signup";

export default function SignUp()
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const supabase = createClient();
    const router = useRouter();

    async function handleSubmit()
    {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if(!error)
        {
            const { data: { user: supaUser } } = await supabase.auth.getUser();

            //setMessage(`Nous vous avons envoyé un email de confirmation à l'adresse ${email}`);

            if(supaUser)
            {
                const res = await signup(supaUser, username, email, password);
                if(res.error) 
                {
                    setMessage(res.error);
                    setShowModal(true);
                    return;
                }

                router.push("/dashboard");
            }
        }

        else
        {
            setMessage(error.message);
            setShowModal(true);
        }
    }
    
    return (
        <div>
            <div>
                <label htmlFor="">email</label>
                <input type="email" required onChange={(e) => setEmail(e.target.value)} />

                <label htmlFor="">password</label>
                <input type="password" required onChange={(e) => setPassword(e.target.value)} />

                <label htmlFor="">username</label>
                <input type="text" required onChange={(e) => setUsername(e.target.value)} />

                <div onClick={handleSubmit}>S'inscrire</div>
            </div>

            {
                showModal &&
                <div>
                    <p>Erreur lors de l'inscription : {message}</p>
                    <button onClick={() => setShowModal(false)}>OK</button>
                </div>
            }
        </div>
    )
}