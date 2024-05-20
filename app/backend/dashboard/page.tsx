"use client";
import {UserContext} from "@/components/AuthedContext/AuthedContext";
import {useContext, useEffect, useState} from "react";
import Sidebar from "@/components/Sidebar/Sidebar";


export default function Dashboard(){
    const { user, setUser } = useContext(UserContext);


    return (
        <Sidebar>
            <></>
        </Sidebar>
    );
}