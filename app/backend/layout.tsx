"use client";
import React, { useEffect, useState } from "react";
import {AuthProvider} from "@/components/AuthedContext/AuthedContext";
import {isLoggedIn} from "@/appwrite";
import {useRouter} from "next/navigation";

const ProtectedLayout = ({
                             children,
                         }: {
    children: React.ReactNode
}) => {

    const [authStatus, setAuthStatus] = useState(false);
    const [loader, setLoader] = useState(true);
    const router = useRouter();

    useEffect(() => {
        isLoggedIn()
            .then(setAuthStatus)
            .catch((e) => router.push("/login"))
            .finally(() => setLoader(false));
    }, []);

    return <AuthProvider value={{ authStatus, setAuthStatus }}>
        {!loader && (
            <>
                <main className="px-2 py-4">{children}</main>
            </>
        )}
    </AuthProvider>

}

export default ProtectedLayout;