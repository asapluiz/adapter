import { SutService } from "./sut_service";
import SchemaValidator from "../../validation/validator";
import { SutData } from "./sut_types";
import { ApiError } from "../../error_handler/error_handler";

export class SutController{


    constructor(private sut_service: SutService){}
    
    public async addSuts<T>(sut_data:T, validator:SchemaValidator<T>){
        await validator.validate(sut_data);
        await this.sut_service.saveSutData(sut_data as SutData)

        return {
            statusCode: 200,
            body: JSON.stringify({successful: "sut data added successfully"})
        }
    }


    public async getSuts(){
        const sut_list = await this.sut_service.listAllSutData()

        const transformedSutResultData = sut_list.map((item)=>{
            const {id, name, description, created, last_modified  } = item
            return {id, name, description, created, lastModified: last_modified}
        })
        

        return {
            statusCode: 200,
            body: JSON.stringify(transformedSutResultData)
        }
    }

    public async getSutById(sut_id:string){
        if(!sut_id){
            throw new ApiError({message:'invalid Sut Id', code:400, status:'Bad request'})
        }

        const sut_data = await this.sut_service.getSingleSutData(sut_id);
        const {id, name, description, created, last_modified  } = sut_data
        
        return {
            statusCode: 200,
            body: JSON.stringify({id, name, description, created, lastModified:last_modified})
        }
    }
}