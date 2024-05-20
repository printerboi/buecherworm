"use client";
import {redirect, useRouter} from "next/navigation";
import {useContext} from "react";
import {UserContext} from "@/components/AuthedContext/AuthedContext";

export default function Home() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    if(!user.id){
        router.replace("/login")
    }
}
