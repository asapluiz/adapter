import { ApiPartialError, ApiErrorInput, ApiErrorOutput } from "../types/error_types"

export class ApiError extends Error {
    public cause:string 
    public requestId:string 
    public code:number 
    public status:string 
    public errors:ApiPartialError[] 


    constructor(error_input:ApiErrorInput){
        super(error_input.message?? "unknown Error")
        Object.setPrototypeOf(this, ApiError.prototype)

        this.cause = error_input.cause?? '';
        this.requestId = error_input.requestId?? '';
        this.code = error_input.code?? 500;
        this.status = error_input.status?? 'Internal Error';
        this.errors = error_input.errors?? [];   
    }


    AddPartialErrors(error:ApiPartialError):void{
        this.errors.push(error)
    }

    toJSON():ApiErrorOutput{
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