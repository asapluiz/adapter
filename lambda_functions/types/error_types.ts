
export type ApiErrorType = {
    cause:string; 
    code:number;
    message:string;
    requestId:string; 
    status:string; 
    errors:ApiPartialError[]; 
}

export type ApiPartialError = {
    code: number;
    detail: string | null;
    message:string;
    status: string;
}