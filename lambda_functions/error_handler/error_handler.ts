import { ApiPartialError, ApiErrorType } from "../types/error_types"

export class ApiError extends Error {
    constructor(
        message:string = "unknown Error", 
        public cause:string = "",
        public code:number = 500,
        public status:string = "Internal Error",
        public requestId:string = "",
        public errors:ApiPartialError[] = [],
        
    ){
        super(message)
        Object.setPrototypeOf(this, ApiError.prototype)
    }


    AddPartialErrors(error:ApiPartialError):void{
        this.errors.push(error)
    }

    toJSON():ApiErrorType{
        return {
            cause: this.cause, 
            code: this.code,
            message: this.message,
            requestId: this.requestId,
            status: this.status, 
            errors:  this.errors
        } 
    }
}