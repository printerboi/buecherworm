"use client";

import HeaderBar from "@/components/HeadBar/HeadBar";
import BackBar from "@/components/BackBar/BackBar";
import BookReview from "@/components/BookReview/BookReview";
import {useEffect, useState} from "react";
import {Book} from "@/lib/types/books";
import {databases} from "@/appwrite";
import {Query} from "appwrite";

interface PageParams {
    params: {
        id: string
    }
}

export default function BookDisplay(queryParams: PageParams) {
    const [ book, setBook ] = useState<Book>();

    useEffect(() => {
        const getData = async () => {
            const result = await databases.getDocument(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'books', // collectionId
                queryParams.params.id// queries (optional)
            );

            if(result){
                setBook(( result as unknown ) as Book)
            }
        }

        getData();
    }, []);

    useEffect(() => {
        console.log(book)
    }, [book]);

    return (
        <div className="container mx-auto mb-16">
            <HeaderBar/>
            <div className="w-full">
                <BackBar name={book?.Name} />
                <BookReview book={book} />
            </div>
        </div>
    );
}
