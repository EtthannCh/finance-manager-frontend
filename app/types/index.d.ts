type PagedData = {
    content: Array<>;
    page:{
        size:number;
        number:number;
        totalElements:number;
        totalPages:number;
    }
}