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
  };

declare module 'pdfjs-dist/webpack.mjs' { export * from 'pdfjs-dist' }