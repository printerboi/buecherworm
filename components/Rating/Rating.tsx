

export default function Rating(props: { rating?: number }) {
    if(props.rating){
        let color = "blue";
        if(props.rating <= 3){
            color = "red";
        }else if(props.rating > 3 && props.rating <= 8 ){
            color = "yellow";
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