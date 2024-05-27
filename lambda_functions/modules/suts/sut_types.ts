
export type SutData = {
    name: string;
    description: string;
    signals: string[]
}

export type SutDbData = {
    id:string;
    name: string; 
    description: string; 
    created:string; 
    lastModified: string  
}

export type SignalDbData = {
    id:string;
    name:string
}
