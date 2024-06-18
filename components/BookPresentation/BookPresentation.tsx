import {getCoverUrl} from "@/lib/util/Thumbnails";
import {Book} from "@/lib/types/books";
import Image from "next/image";
import Spinner from "@/components/Spinner/Spinner";

export interface Props {
    book: Book
}

function truncateString(str: string, maxLength: number, ending = '...') {
    if (str.length > maxLength) {
        return str.slice(0, maxLength - ending.length) + ending;
    }
    return str;
}

export default function BookPresentation({ book }: Props){
    const BookContent = () => {
        return (
            <div
                className="flex flex-col content-between shadow-2xl rounded-xl hover:-translate-y-2 hover:cursor-pointer ease-out duration-300 h-full pb-2">
                <div className="p-4 rounded-xl flex flex-col justify-center items-center h-80">
                    <Image alt={"cover"} width={170} height={300} className="rounded-xl object-contain"
                           src={getCoverUrl("ISBN", book.isbn, "M")}/>
                </div>
                <div className="flex flex-col pl-8 pr-8 pt-2 pb-2">
                    <div className="w-full text-sm">{truncateString(book.Name, 30)}</div>
                    <div className="w-full text-sm text-gray-500">{book.authors[0].Name}</div>
                </div>
            </div>
        );
    }

    return (
        <a href={`/book/${book.$id}`}>
            {(book !== undefined) ? <BookContent/> : <Spinner/>}
        </a>
    );
}