
export interface Publisher{
    $id: string,
    Name: string
}

export interface Author{
    $id: string,
    Name: string
}

export enum BookState {
    NOTREAD,
    INREAD,
    FINISHED
}

export interface Book{
    $id: string,
    Name: string,
    authors: Array<Author>,
    publisher: Publisher,
    year: number,
    pages: number,
    rating?: number,
    tags: Array<string>,
    comment?: string
    finishedAt?: number,
    state: BookState,
    isbn: string,
    loadImage: boolean
}