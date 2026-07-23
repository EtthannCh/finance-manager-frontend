type PagedData = {
    content: Array<>;
    page:{
        size:number;
        number:number;
        totalElements:number;
        totalPages:number;
    }
}

type Receipt = {
    id: string;
    materialName: string;
    qty: number | string;
    price: number | string;
    totalPrice: string | number;
    length: number | string; // Berapa meter/kaki
    unitOfMeasure: number | string; // Harga per meter/kaki
  };

declare module 'pdfjs-dist/webpack.mjs' { export * from 'pdfjs-dist' }