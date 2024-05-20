import { cookies } from "next/headers";
import {AppwriteException, Storage} from "appwrite";
import { Client, Account, Databases } from 'appwrite';


const client = new Client();
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string);

export const account= new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);