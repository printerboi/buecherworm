"use client";
import {useEffect, useState} from "react";
import {Book} from "@/lib/types/books";
import HeaderBar from "@/components/HeadBar/HeadBar";
import BookPresentation from "@/components/BookPresentation/BookPresentation";
import {databases} from "@/appwrite";
import {Query} from "appwrite";
import {number} from "prop-types";

export default function Reading() {
    const [ books, setBooks ] = useState(Array<Book>());
    useEffect(() => {
        const getData = async () => {
            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'books', // collectionId
                [
                    Query.equal("state", 1)
                ] // queries (optional)
            );

            if(result.documents){
                setBooks(( result.documents as unknown ) as Array<Book>)
            }
        }

        getData();
    }, []);

    const BookGrid = () => {
        const GRIDELEMENTS = 4;
        const rowNumber = Math.ceil(books.length / 4 );
        const rows = [];

        for(let row = 0; row < rowNumber; row++){
            rows.push(<div key={`barrier-${row}-0`} className="col-span-1"></div>);
            for(let book = 0; book < GRIDELEMENTS; book++){
                const index = row*GRIDELEMENTS + book;
                if(index >= books.length){
                    rows.push(<div key={index} className="col-span-1"></div>);
                }else{
                    const bookObject = books[index];
                    rows.push(<BookPresentation key={index} book={bookObject}/>)
                }
            }
            rows.push(<div key={`barrier-${row}-1`} className="col-span-1"></div>);
        }


        return rows;
    }

    return (
        <div className="container mx-auto mb-16">
            <HeaderBar />
            <div className="w-full">
                <div className="grid grid-cols-6 gap-8">
                    {
                        (books.length != 0)?
                            <BookGrid />:
                            <>
                                <div className="col-span-2" />
                                <div className="col-span-2 flex flex-row justify-center items-center font-bold text-4xl text-center text-gray-400">
                                    <h2>I&apos;m not currently reading anything..</h2>
                                </div>
                                <div className="col-span-2"/>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}
