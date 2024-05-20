"use client"
import {createContext, Dispatch, useEffect, useState} from "react";
import { account } from "@/appwrite";

interface ContextProps {
    children: React.ReactNode,
}

interface User {
    email: string;
    id: string;
}

export interface ctx {
    user: User,
    setUser: Dispatch<any>
}

export const UserContext= createContext({} as ctx);


export default function ContextProvider(context: ContextProps) {
    const [user, setUser] = useState({} as User);

    useEffect(()=>
    {
        (async function()
        {
            try{
                const res=await account.get();
                // const res=await account.getSession('current');
                setUser({ email: res.email, id: res.$id})
                console.log(res)
            }catch(err) {
                console.log(err)
            }

        }())
    },[])

    return(
        <UserContext.Provider value={{user, setUser}} >{context.children}</UserContext.Provider>
    )
}