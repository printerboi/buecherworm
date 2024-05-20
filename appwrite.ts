import { cookies } from "next/headers";
import {AppwriteException, Storage} from "appwrite";
import { Client, Account, Databases } from 'appwrite';

type LoginUserAccount = {
    email: string,
    password: string,
}

export const  getCurrentUser = async () => {
    try {
        return account.get()
    } catch (error) {
        console.log("getcurrentUser error: " + error)

    }
    return null
}

export const login = async ( { email, password }: LoginUserAccount)=> {
    try {
        console.log("attempting create...");
        const test = await account.createEmailPasswordSession(email, password);
        console.log(test);
        return test;
    } catch (error:any) {
        console.log(error);
        throw error
    }
}

export const isLoggedIn = async () => {
    try {
        const data = await getCurrentUser();
        return Boolean(data)
    } catch (error) {
        throw error;
    }

    return false
}

export const logout = async() => {
    try {
        return await account.deleteSession("current")
    } catch (error) {
        console.log("logout error: " + error)
    }
}

const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

export const account= new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);