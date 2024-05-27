import { SutService } from "./sut_service";
import SchemaValidator, {validateIds} from "../../validation/validator";
import { SutData } from "./sut_types";
import addSutDataSchema from "./schemas/add_sut_data_schema";

export class SutController{
    constructor(private sut_service: SutService){}
    
    public async addSuts(sut_data:SutData){
        const validator = new SchemaValidator(addSutDataSchema)

        await validator.validate(sut_data);
        await this.sut_service.saveSutData(sut_data)

        return {
            statusCode: 200,
            body: JSON.stringify({successful: "sut data added successfully"})
        }
    }


    public async getSuts(){
        const sut_list = await this.sut_service.listAllSutData()

        const transformedSutResultData = sut_list.map((item)=>{
            const {id, name, description, created, lastModified  } = item
            return {id, name, description, created, lastModified}
        })
        

        return {
            statusCode: 200,
            body: JSON.stringify({suts:transformedSutResultData})
        }
    }

    public async getSutById(sut_id:string){
        await validateIds([sut_id])

        const sut_data = await this.sut_service.getSingleSutData(sut_id);
        const {id, name, description, created, lastModified  } = sut_data
        
        return {
            statusCode: 200,
            body: JSON.stringify({sut:{id, name, description, created, lastModified}})
        }
    }

    public async getSutSignals(sut_id:string){
        await validateIds([sut_id])

        await this.sut_service.getSingleSutData(sut_id)
        const sut_signals = await this.sut_service.retrieveSutSignalData(sut_id);


        const transformedSignalData = sut_signals.map((item)=>{
            return {id: item.id, name: item.name}
        })

        return {
            statusCode: 200,
            body: JSON.stringify(transformedSignalData)
        }
    }
}