import {Book} from "@/lib/types/books";
import {getCoverUrl} from "@/lib/util/Thumbnails";
import {useEffect} from "react";
import Tag from "@/components/Tag/Tag";
import moment from "moment/moment";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";


export interface Props {
    book: Book | undefined
}

export default function BookReview({ book }: Props){

    const PreviewContent = () => {
        return (
            <>
                <div className="w-1/3 h-full flex flex-col items-center">
                    <Image width={300} height={100} alt={"Cover"} className="w-5/6"
                           src={getCoverUrl("ISBN", (book !== undefined) ? book.isbn : undefined, "L")}/>
                </div>
                <div className="w-2/3 flex flex-col items-center">
                    <div>
                        <div className="px-4 sm:px-0">
                            <h3 className="text-base font-semibold leading-7 text-gray-900">Book Information</h3>
                        </div>
                        <div className="mt-6 border-t border-gray-100">
                            <dl className="divide-y divide-gray-100">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {book?.Name}
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Authors</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {book?.authors.map((author, index) => {
                                            if (index < book?.authors.length - 1) {
                                                return `${author.Name},`
                                            } else {
                                                return `${author.Name}`
                                            }
                                        })}
                                    </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                    <dt className="text-sm font-medium leading-6 text-gray-900">Tags</dt>
                                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {book?.tags.map((text: string, index: number) => {
                                            return <Tag key={index} text={text}/>
                                        })}
                                    </dd>
                                </div>
                                {(book?.state === 2)?
                                    <>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">Rating</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{book?.rating}/10</dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">Finished at</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{moment(book?.finishedAt).format('L')}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                            <dt className="text-sm font-medium leading-6 text-gray-900">Comment</dt>
                                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{book?.comment}
                                            </dd>
                                        </div>
                                    </>:
                                    <></>
                                }
                            </dl>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="w-full shadow-2xl flex flex-row gap-x-8 max-w-7xl ml-56 px-8 py-20 rounded-xl">
            {(book !== undefined) ? <PreviewContent/> : <Spinner/>}
        </div>
    );
}