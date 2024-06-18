

export function getCoverUrl(key: string, value: string | undefined, size: string){
    if(value !== undefined){
        return `https://covers.openlibrary.org/b/${key}/${value}-${size}.jpg `
    }else{
        let measurements = "150x150";
        switch (size) {
            case  "S":
                measurements = "35x58";
                break;
            case "M":
                measurements = "70x116";
                break;
            case "L":
                measurements = "420x500";
                break;
        }
        return `https://placehold.co/${measurements}/png`;
    }
}