import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { SutData, SutDbData, SignalDbData } from "./sut_types";
import { ApiError } from '../../error_handler/error_handler';


export class SutService{
    private tableName:string = process.env.DB_NAME || ''
    private dynamoDb = new AWS.DynamoDB.DocumentClient();


    public async saveSutData(data:SutData){
        const sut_id = await this.generateUUID()

        const signals_param = await this.prepareSignalValues(data.signals, sut_id)
        const sut_params:any = [
            {
                Put:{
                    TableName: this.tableName,
                    Item: {
                        id:`${sut_id}`,
                        pk: `sut#${sut_id}`,
                        sk: `metadata#${sut_id}`,
                        name: data.name,
                        description: data.description,
                        created: new Date().toISOString(),
                        last_modified: new Date().toISOString()
                    },
                    ConditioExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
                }
            }
        ]

        const params ={TransactItems: sut_params.concat(signals_param)} 
        const result = await this.dynamoDb.transactWrite(params).promise()
        return result;
        
    }

    private async prepareSignalValues(signals:string[], sut_id:string){
        let prepared_signal_params = []
           
        for(let item of signals){
            const signal_id = await this.generateUUID()
            const signal_param = {
                Put:{
                    TableName: this.tableName,
                    Item: {
                        pk: `sut#${sut_id}`,
                        sk: `signal#${signal_id}`,
                        id:signal_id,
                        name: item
                    },
                    ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
                }
            }
            prepared_signal_params.push(signal_param)
        }

        return prepared_signal_params;
    }

    private async generateUUID(){
        const myuuid = uuidv4();
        return myuuid;
    }

    public async listAllSutData(){
        
        const partition_key_prefix = 'sut#';
        const sort_key_prefix = 'metadata#';

        const params = {
            TableName: this.tableName,
            FilterExpression: 'begins_with(#pk, :pkPrefix) AND begins_with(#sk, :skPrefix)',
            ExpressionAttributeNames: {
              '#pk': 'pk', 
              '#sk': 'sk'  
            },
            ExpressionAttributeValues: {
              ':pkPrefix': partition_key_prefix,
              ':skPrefix': sort_key_prefix
            }
        };

        const result = await this.dynamoDb.scan(params).promise();
        
        if(!result.Items || result.Items.length === 0){
            throw new ApiError({message:'No Sut Found', code:404, status:'Not Found'})
        }
        return result.Items as SutDbData[]
    }

    public async getSingleSutData(sut_id:string){
        const params = {
            TableName: this.tableName,
            Key:{
              pk: `sut#${sut_id}`,
              sk: `metadata#${sut_id}`
            }
          }
    
          const data = await this.dynamoDb.get(params).promise() 
    
          if(!data.Item){
            throw new ApiError({message:'SUT not found', code:404, status:'Not Found'})
          }
          return data.Item as SutDbData
    }

    public async retrieveSutSignalData(sut_id:string){
        const partition_key = `sut#${sut_id}`;
        const sort_key_prefix = 'signal#';

        const params = {
            TableName: this.tableName,
            KeyConditionExpression: '#pk = :pkValue AND begins_with(#sk, :skPrefix)',
            ExpressionAttributeNames: {
              '#pk': 'pk', 
              '#sk': 'sk'  
            },
            ExpressionAttributeValues: {
              ':pkValue': partition_key,
              ':skPrefix': sort_key_prefix
            }
        };

        const result = await this.dynamoDb.query(params).promise();
        
        return result.Items as SignalDbData[]

    }
}