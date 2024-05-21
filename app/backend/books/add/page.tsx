"use client";
import Sidebar from "@/components/Sidebar/Sidebar";
import {Dispatch, useEffect, useRef, useState} from "react";
import {Author, Book, BookState, Publisher} from "@/lib/types/books";
import {databases, storage} from "@/appwrite";
import {ID, Query} from "appwrite";
import moment from "moment";
import {useRouter} from "next/navigation";



export default function Books() {
    const [ book, setBook ] = useState({} as Book );
    const router = useRouter();
    const [ authors, setAuthors ] = useState(Array<Author>());
    const [ publisher, setPublisher ] = useState(Array<Publisher>());
    const [ updatedAuthors, setUpdatedAuthors ] = useState(0);
    const [ updatedPublishers, setUpdatedPublishers ] = useState(0);
    const [ readingState, setReadingState ] = useState(0);

    const [ newAuthor, setNewAuthor ] = useState("");
    const [ newPublisher, setNewPublisher ] = useState("");

    const [ name, setName ] = useState("");
    const [ selectedAuthors, setSelectedAuthors ] = useState(Array<string>);
    const [ selectedPublisher, setSelectedPublisher ] = useState("");
    const [ publishedIn, setPublishedIn ] = useState(1970);
    const [ finishedAt, setFinishedAt ] = useState("1970-01-01 00:00:00");
    const [ rating, setRating ] = useState(0.0);
    const [ comment, setComment ] = useState("");
    const [ tags, setTags ] = useState(Array<string>());
    const [ pages, setPages ] = useState(0);
    const [ isbn, setIsbn ] = useState("");
    const [ loadImage, setLoadImage ] = useState(false);


    useEffect(() => {
        const getAuthors = async () => {
            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'authors', // collectionId
                [] // queries (optional)
            );

            if(result.documents && result.documents.length > 0){
                setAuthors(( result.documents as unknown ) as Array<Author>)
                setSelectedAuthors([ result.documents[0].$id ]);
            }
        }

        getAuthors();
    }, [updatedAuthors]);

    useEffect(() => {
        const getPublishers = async () => {
            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'publisher', // collectionId
                [] // queries (optional)
            );

            if(result.documents){
                setPublisher(( result.documents as unknown ) as Array<Publisher>)
                setSelectedPublisher(result.documents[0].$id);
            }
        }

        getPublishers();
    }, [updatedPublishers]);



    return (
        <Sidebar>
            <div className="flex flex-col items-center">
                <div className="relative overflow-x-auto flex flex-col w-1/2 justify-center my-16">
                    <form className="flex flex-col gap-8" onSubmit={async (formev) => {
                        formev.preventDefault();
                        if(name != "" && selectedAuthors.length > 0 && selectedPublisher != "" && publishedIn >= 1024 && publishedIn <= new Date().getFullYear() && ( readingState == 0 || readingState == 1 || readingState == 2 )){
                            try {
                                let result;

                                if(readingState == 2) {
                                    result = await databases.createDocument(
                                        process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                                        'books', // collectionId
                                        ID.unique(),
                                        {
                                            Name: name,
                                            authors: selectedAuthors,
                                            publisher: selectedPublisher,
                                            year: publishedIn,
                                            tags: tags,
                                            comment: comment,
                                            state: readingState,
                                            rating: rating,
                                            finishedAt: finishedAt,
                                            pages: pages,
                                            isbn: isbn,
                                            loadImage: loadImage
                                        }
                                    );
                                }else {
                                    result = await databases.createDocument(
                                        process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                                        'books', // collectionId
                                        ID.unique(),
                                        {
                                            Name: name,
                                            authors: selectedAuthors,
                                            publisher: selectedPublisher,
                                            year: publishedIn,
                                            tags: tags,
                                            comment: comment,
                                            state: readingState,
                                            pages: pages,
                                            isbn: isbn,
                                            loadImage: loadImage
                                        }
                                    );
                                }

                                console.log(result);

                                router.push("/backend/books");
                            }catch (err) {
                                console.log(err);
                            }
                        }
                    }}>
                        <div className="flex flex-row gap-8">
                            <div className="w-1/2">
                                <label htmlFor="book_name"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="text" id="book_name"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       placeholder="Name of the book" required
                                       onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="book_isbn"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ISBN</label>
                                <input type="text" id="book_isbn"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       placeholder="ISBN of the book" required
                                       onChange={(e) => setIsbn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-8">
                            <div className="w-1/2">
                                <label htmlFor="authors"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Authors</label>
                                <select multiple id="authors"
                                        className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                        onChange={(e) => {
                                            const values = Array.from(e.target.selectedOptions, option => option.value);
                                            setSelectedAuthors(values);
                                        }}                                >
                                    {authors.map((author) => {
                                            return <option key={author.$id} value={author.$id}>{author.Name}</option>
                                        }
                                    )}
                                </select>

                                <div className="mt-2">
                                    <div>
                                        <label htmlFor="add_author_name"
                                               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Add Author</label>
                                        <div className="relative">
                                            <input type="text" id="add_author_name"
                                                   className="block w-full p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                                                   placeholder="Name of the author"
                                                   onChange={(e) => setNewAuthor(e.target.value)}
                                            />
                                            <button type="button"
                                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={async () => {
                                                        if(newAuthor) {
                                                            try {
                                                                await databases.createDocument(
                                                                    process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                                                                    'authors', // collectionId
                                                                    ID.unique(),
                                                                    {
                                                                        Name: newAuthor
                                                                    }
                                                                );
                                                                setUpdatedAuthors(updatedAuthors + 1);
                                                                setNewAuthor("");
                                                            }catch (e) {
                                                                console.error(e);
                                                            }
                                                        }
                                                    }}
                                            >+
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-1/2">
                                <label htmlFor="publisher"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Publisher</label>
                                <select id="publisher"
                                        className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                        onChange={(e) => { console.log(e.target.value); setSelectedPublisher(e.target.value) }}
                                >
                                    {publisher.map((publisher) => {
                                            return <option key={publisher.$id}
                                                           value={publisher.$id}>{publisher.Name}</option>
                                        }
                                    )}
                                </select>

                                <div className="mt-2">
                                    <div>
                                        <label htmlFor="add_publisher_name"
                                               className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Add
                                            Publisher</label>
                                        <div className="relative">
                                            <input type="text" id="add_author_name"
                                                   className="block w-full p-4 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none"
                                                   placeholder="Name of the publisher"
                                                   onChange={(e) => setNewPublisher(e.target.value)}
                                            />
                                            <button type="button"
                                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    onClick={async () => {
                                                        if(newPublisher) {
                                                            try {
                                                                await databases.createDocument(
                                                                    process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                                                                    'publisher', // collectionId
                                                                    ID.unique(),
                                                                    {
                                                                        Name: newPublisher
                                                                    }
                                                                );
                                                                setUpdatedPublishers(updatedPublishers + 1);
                                                                setNewAuthor("");
                                                            }catch (e) {
                                                                console.error(e);
                                                            }
                                                        }
                                                    }}
                                            >+
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-8">
                            <div className="w-1/3">
                                <label htmlFor="pages"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number
                                    of pages</label>
                                <input type="number" min={0} max={8000} id="pages"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       required
                                       onChange={(e) => setPages(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="w-1/3">
                                <label htmlFor="book_year"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Published
                                    in</label>
                                <input type="number" min={1024} max={new Date().getFullYear()} id="book_year"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       placeholder={new Date().getFullYear().toString()} required
                                       onChange={(e) => setPublishedIn(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="w-1/3 flex flex-col justify-center">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value={""} onChange={(e) => setLoadImage(e.target.checked)} checked={loadImage} className="sr-only peer"/>
                                    <div
                                        className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Load Cover</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-row gap-8">
                            <div className="w-1/3">
                                <label htmlFor="state"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">State</label>
                                <select id="state"
                                        className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                        onChange={(e) => {
                                            const selectedState = parseInt(e.target.value);
                                            if (selectedState != 2) {
                                                setFinishedAt("1970-01-01 00:00:00");
                                                setRating(0.0);
                                            }
                                            setReadingState(selectedState);
                                        }}>
                                    <option value={0}>Not read yet</option>
                                    <option value={1}>Reading</option>
                                    <option value={2}>Finished</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label htmlFor="finishedAt"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Finished
                                    at</label>
                                <input disabled={(readingState != 2)} type="date" id="finishedAt"
                                       onChange={(e) => {
                                           console.log(e.target.value);
                                           setFinishedAt(moment(e.target.value).toDate().toISOString().slice(0, 19).replace('T', ' '))
                                       }}
                                       className="bg-gray-50 border focus:outline-none border-gray-300 disabled:text-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>

                            <div className="w-1/3">
                                <label htmlFor="rating"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rating</label>
                                <input disabled={(readingState != 2)} type="number" min={0} max={10} step={0.1} id="rating"
                                       onChange={(e) => setRating(parseFloat(e.target.value))}
                                       className="bg-gray-50 border focus:outline-none border-gray-300 disabled:text-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>

                            <label htmlFor="comment"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comment</label>
                            <textarea id="comment" rows={4}
                                      className="block p-2.5 focus:outline-none w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                      onChange={(e) => {setComment(e.target.value)}}
                                      placeholder="Comment..."></textarea>

                        </div>

                        <div>
                            <label htmlFor="tags"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                            <input type="text" id="tags"
                                   className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                   onChange={(e) => {setTags(e.target.value.split("|"))}}
                                   placeholder="Seperate tags by |"/>
                        </div>

                        <div className="flex flex-row justify-center items-center">
                            <button type="submit"
                                    className="w-1/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}