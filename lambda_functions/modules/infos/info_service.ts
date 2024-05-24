import { InfoData } from "./info_types";
import { ApiError } from "../../error_handler/error_handler";
import * as AWS from 'aws-sdk';


export class InfoService{
    private tableName:string = process.env.DB_NAME || ""
    private dynamoDb = new AWS.DynamoDB.DocumentClient();

    public async updateInfoData(data:InfoData){
        const params = {
            TableName: this.tableName,
            Item: {
              pk: 'info',
              sk: 'info',
              name: data.name,
              numberOfParallelExecutions: data.numberOfParallelExecutions,
              version: data.version,
              requiresTestEnvironments: data.requiresTestEnvironments
            }
          };
        await this.dynamoDb.put(params).promise();
        return 
    }

    public async retrieveInfoData(){
        const params = {
            TableName: this.tableName,
            Key:{
              pk: 'info',
              sk: 'info'
            }
        }
        const data = await this.dynamoDb.get(params).promise() 

        if(!data.Item){
            throw new ApiError({message:'No info data stored', code:404, status:'Not Found'})
        }

        return data.Item as InfoData
    }
}