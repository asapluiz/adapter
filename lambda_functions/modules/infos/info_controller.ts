import { InfoService } from "./info_service";
import SchemaValidator from "../../validation/validator";
import { InfoData } from "./info_types";
import infoDataSchema from "./schemas/info_schema";


export class InfoController{
    constructor(private info_service:InfoService){}


    public async updateInfo(info_data:InfoData){
        const validator = new SchemaValidator(infoDataSchema)
        await validator.validate(info_data);
        await this.info_service.updateInfoData(info_data as InfoData)

        return {
            statusCode: 200,
            body: JSON.stringify("Info data updated successfully")
        }
    }

    public async getInfo(){
        const info_data = await this.info_service.retrieveInfoData()
        const {name, numberOfParallelExecutions, requiresTestEnvironments, version} = info_data

        return {
            statusCode: 200,
            body: JSON.stringify({name, numberOfParallelExecutions, requiresTestEnvironments, version})
        }
    }
}