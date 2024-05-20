
interface CompponentProps {
    text: string,
    active: boolean
}

export default function Alert(props: CompponentProps){
    if(props.active){
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                {props.text}
            </div>
        );
    }else{
        return (
            <></>
        );
    }
}