import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCircleArrowLeft} from "@fortawesome/free-solid-svg-icons";

export interface Props {
    name: string | undefined
}

export default function BackBar({ name } : Props){
    return (
        <div className="mx-auto flex max-w-7xl items-center p-6 lg:px-8">
            <span className="text-4xl text-gray-300 hover:text-gray-600"><a href={"/"}><FontAwesomeIcon icon={faCircleArrowLeft} /></a></span>
            <span className="text-4xl text-gray-300 px-8 font-bold">{(name)? name: "Loading..."}</span>
        </div>
    );
}