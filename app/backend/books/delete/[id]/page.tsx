"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import {Author, Book, BookState, Publisher} from "@/lib/types/books";
import {databases} from "@/appwrite";
import {ID, Query} from "appwrite";
import moment from "moment";
import {useRouter} from "next/navigation";

interface PageParams {
    params: {
        id: string
    }
}

export default function BookEdit(queryParams: PageParams) {
    const [ book, setBook ] = useState({} as Book );
    const router = useRouter();
    const [ bookId, setBookId ] = useState("");
    const [ name, setName ] = useState("");

    useEffect(() => {
        const loadData = async () => {
            console.log(queryParams.params.id);
            if(queryParams.params.id){
                const result = await databases.getDocument(
                    process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                    'books', // collectionId
                    queryParams.params.id // queries (optional)
                );

                console.log(result);

                if(result){
                    setName(result.Name);
                    setBookId(queryParams.params.id);
                }else{
                    router.replace("/backend/dashboard");
                }
            }else{
                router.replace("/backend/dashboard");
            }
        }

        loadData();
    }, [queryParams]);


    return (
        <Sidebar>
            <div className="flex flex-col items-center">
                <div className="relative overflow-x-auto flex flex-col w-1/2 justify-center my-16">
                    <form className="flex flex-col gap-8" onSubmit={async (formev) => {
                        formev.preventDefault();
                        try {
                            await databases.deleteDocument(
                                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                                'books', // collectionId
                                bookId,
                            );
                            router.push("/backend/books");
                        } catch (err) {
                            console.log(err);
                        }
                    }}>


                        <div
                            className="flex flex-col px-8 py-8 items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <div className="flex flex-col p-4 leading-normal">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Delete
                                    Book</h5>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Do you really want to
                                    delete the book with the title <span
                                        className="font-bold">{name}</span>?</p>
                            </div>

                            <div className="flex flex-row gap-8 items-center justify-center">
                                <button type="submit"
                                        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Delete
                                </button>

                                <button type="button" onClick={() => router.push("/backend/books")}
                                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}