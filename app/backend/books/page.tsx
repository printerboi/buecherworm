"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import {databases, storage} from "@/appwrite";
import {Query} from "appwrite";
import {Author, Book, BookState} from "@/lib/types/books";
import moment from "moment";
import {it} from "node:test";


export default function Books() {
    const [ books, setBooks ] = useState(Array<Book>());
    const [ offset, setOffset ] = useState(0);
    const [ perPage, setPerPage ] = useState(50);

    useEffect(() => {
        const getData = async () => {
            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'books', // collectionId
                [Query.offset(offset * perPage), Query.limit(perPage)] // queries (optional)
            );

            if(result.documents){
                setBooks(( result.documents as unknown ) as Array<Book>)
            }
        }

        getData();
    }, []);

    useEffect(() => {
        console.log(books);
    }, [books]);


    const ReadState = (props:{ state: BookState, finishedAt?: number }) => {
        switch (props.state){
            case BookState.NOTREAD:
                return (
                    <span className="w-20 text-center bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Not read</span>
                );
            case BookState.INREAD:
                return (
                    <span className="w-20 text-center bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">In read</span>
                );
            case BookState.FINISHED:
                return (
                    <div className="w-auto flex flex-col">
                        <span className="w-20 text-center bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Finished</span>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">{moment(props.finishedAt).format('L')}</p>
                    </div>
                );
        }
    }

    const Rating = (props: { rating?: number }) => {
        if(props.rating){
            let color = "blue";
            if(props.rating <= 3){
                color = "red";
            }else if(props.rating > 3 && props.rating <= 8 ){
                color = "blue";
            }else{
                color = "green";
            }

            return (
                <p className={`bg-${color}-100 text-${color}-800 text-sm font-semibold inline-flex items-center p-1.5 rounded dark:bg-${color}-200 dark:text-${color}-800`}>{props.rating.toFixed(1)}</p>
            );
        }else{
            return <></>;
        }
    }

    const Tag = (props: { text: string }) => {
        return (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{props.text}</span>
        );
    }


    const ListItem = ({item}: { item: Book }) => {
        const [ image, setImage ] = useState<URL>(new URL("http://localhost/v1/storage/buckets/664a561100261dd76e96/files/PLACEHOLDER/view?project=6649f45b00123d19538f&mode=admin"));

        useEffect(() => {
            const getImage = async () => {
                try{
                    const result = storage.getFilePreview(
                        process.env.NEXT_PUBLIC_BOOK_IMAGE_BUCKET as string, // bucketId
                        item.$id, // fileId
                    );

                    console.log(result);
                    setImage(result);
                }catch (e){
                    const result = storage.getFilePreview(
                        process.env.NEXT_PUBLIC_BOOK_IMAGE_BUCKET as string, // bucketId
                        "PLACEHOLDER", // fileId
                    );

                    setImage(result);
                }
            }

            getImage();
        }, []);

        return (
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">
                    <div className="flex-shrink-0">
                        <img className="w-16 h-16 rounded-full"
                             src={image.href}
                             alt="Neil image"/>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.Name}
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {item.authors.map((author: Author, index: number) => {
                                if (index < item.authors.length - 1) {
                                    return `${author.Name},`;
                                } else {
                                    return `${author.Name}`;
                                }
                            })}
                        </p>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.publisher.Name} ({item.year})
                        </p>
                        <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {item.pages} Pages
                        </p>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <ReadState state={item.state} finishedAt={item.finishedAt}/>
                </td>
                <td className="px-6 py-4">
                    <Rating rating={item.rating} />
                </td>
                <td className="px-6 py-4">
                    {item.tags.map((tag: string, tagIndex: number) => {
                        return <Tag key={tagIndex} text={tag} />;
                    })}
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-row">
                        <a href={`/backend/books/edit/${item.$id}`}
                            className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group hover:cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                            </svg>
                        </a>

                        <a href={`/backend/books/delete/${item.$id}`}
                            className="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group hover:cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                            </svg>
                        </a>
                    </div>
                </td>
            </tr>
        );
    }


    return (
        <Sidebar>
            <div className="w-full flex flex-col gap-8">
                <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-row w-full">
                        <a href="/backend/books/add" className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">+</a>
                    </div>

                    <div className="flex flex-row w-1/3">
                        <form className="w-full">
                            <label htmlFor="default-search"
                                   className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="search" id="default-search"
                                       className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Search Mockups, Logos..." required/>
                                <button type="submit"
                                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {(books.length) ?
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Image</th>
                                <th scope="col" className="px-6 py-3">Book</th>
                                <th scope="col" className="px-6 py-3">Publisher</th>
                                <th scope="col" className="px-6 py-3">State</th>
                                <th scope="col" className="px-6 py-3">Rating</th>
                                <th scope="col" className="px-6 py-3">Tags</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {books.map((book) => {
                                return <ListItem key={book.$id} item={book}/>
                            })}
                            </tbody>
                        </table>
                    </div>
                :
                    <div className="flex w-full flex-row justify-center py-12 items-center">
                        <p>No books in the database yet!</p>
                    </div>
                }
            </div>
        </Sidebar>
    );
}