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

    const [ imageFile, setImageFile ] = useState<File>();


    useEffect(() => {
        const getAuthors = async () => {
            const result = await databases.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE as string, // databaseId
                'authors', // collectionId
                [] // queries (optional)
            );

            if(result.documents){
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


    const Avatar = ({ imageFile, setImageFile } : { imageFile: File | undefined, setImageFile: Dispatch<File> }) => {
        const [ image, setImage ] = useState("");

        useEffect(() => {

            const reader= new FileReader();
            // it's onload event and you forgot (parameters)
            reader.onload = function(e)  {
                if(e.target?.result){
                    setImage(e.target.result as string);
                }
            }
            // you have to declare the file loading
            if(imageFile){
                reader.readAsDataURL(imageFile);
            }

        }, [imageFile]);

        const getAvatar = () => {
            if (image) {
                return (
                    <img className="bg-cover" src={image} alt="Extra large avatar" />
                );
            } else {
                return (
                    <div className="rounded w-64 h-64 flex center flex-col justify-center content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-48 h-48 text-gray-500 dark:text-gray-400 self-center">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
                        </svg>
                    </div>
                );
            }
        }

        return (
            <div className="flex flex-col">
                <div className="w-full flex flex-row justify-center">
                    <div className="relative w-64 h-64 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        {getAvatar()}
                    </div>
                </div>

                <div className="flex flex-col w-1/3 justify-center content-center self-center mt-8">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                           htmlFor="file_input">Upload file</label>
                    <input
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file_input" type="file"
                        onChange={(e: any) => {
                            if(e.target.files) {
                                setImageFile(e.target.files[0]);
                            }
                        }}
                    />

                </div>
            </div>
        );
    }

    return (
        <Sidebar>
            <div className="flex flex-col items-center">
                <div className="w-full mt-8 divide-y gap-16">
                    <Avatar imageFile={imageFile} setImageFile={setImageFile}/>
                </div>

                <div className="relative overflow-x-auto flex flex-col w-1/2 justify-center my-16">
                    <form className="flex flex-col gap-8" onSubmit={async (formev) => {
                        formev.preventDefault();
                        console.log(name, selectedAuthors, selectedPublisher, publishedIn, readingState)
                        console.log(name != "" && selectedAuthors.length > 0 && selectedPublisher != "" && publishedIn >= 1970 && publishedIn <= new Date().getFullYear() && ( readingState == 0 || readingState == 1 || readingState == 2 ));
                        if(name != "" && selectedAuthors.length > 0 && selectedPublisher != "" && publishedIn >= 1970 && publishedIn <= new Date().getFullYear() && ( readingState == 0 || readingState == 1 || readingState == 2 )){
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
                                            pages: pages
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
                                            pages: pages
                                        }
                                    );
                                }

                                console.log(result);

                                if(imageFile && result.$id) {
                                    const uploadResult = await storage.createFile(
                                        process.env.NEXT_PUBLIC_BOOK_IMAGE_BUCKET as string, // bucketId
                                        result.$id, // fileId
                                        imageFile
                                    );
                                }

                                //router.push("/backend/books");
                            }catch (err) {
                                console.log(err);
                            }
                        }
                    }}>
                        <div>
                            <label htmlFor="book_name"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                            <input type="text" id="book_name"
                                   className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                   placeholder="Name of the book" required
                                   onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-row gap-8">
                            <div className="w-1/2">
                                <label htmlFor="authors"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Authors</label>
                                <select multiple id="authors"
                                        className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                        onChange={(e) => { console.log(e.target.value) }}
                                >
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
                            <div className="w-1/2">
                                <label htmlFor="pages"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Number
                                    of pages</label>
                                <input type="number" min={0} max={8000} id="pages"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       required
                                       onChange={(e) => setPages(parseInt(e.target.value))}
                                />
                            </div>

                            <div className="w-1/2">
                                <label htmlFor="book_year"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Published
                                    in</label>
                                <input type="number" min={1024} max={new Date().getFullYear()} id="book_year"
                                       className="bg-gray-50 border focus:outline-none border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                       placeholder={new Date().getFullYear().toString()} required
                                       onChange={(e) => setPublishedIn(parseInt(e.target.value))}
                                />
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
                                            if(selectedState != 2) {
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
                                <input disabled={(readingState != 2)} type="number" min={0} max={10} id="rating"
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