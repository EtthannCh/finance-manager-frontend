export type Header = {
    "user-id": string;
    "user-name": string;
}

export async function getData(url: string, method: string, header: Header) {
    const res = await fetch(url, {
        method: method,
        headers: header
    })
    return res.json();
}