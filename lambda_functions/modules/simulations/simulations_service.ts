import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { simulationsData, SimulationExecutionDbData } from "./simulations_types";
import { ApiError } from '../../error_handler/error_handler';


/// come back and get the sut id the right way
export class SimulationService{
    private tableName:string = process.env.DB_NAME || ""
    private dynamoDb = new AWS.DynamoDB.DocumentClient();
    

    public async saveSimulationExecutionData(data:simulationsData ){
        const simulation_execution_id = await this.generateUUID()
        const params = {
            TableName: this.tableName,
            Item: {
              pk: `sut#${data.sutId}`,
              sk: `simulationexecution#${simulation_execution_id}`,
              name: data.simulationName,
              created_by: data.createdBy,
              scenario_data: data.scenarioData,
              record_signals: data.recordSignals
            },
            ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
          };
        await this.dynamoDb.put(params).promise();
        
        return simulation_execution_id
    }

    public async getSimulationExecutionData(simulation_execution_id:string){
      let sut_id = "a3364909-73dd-4095-962a-eff1bad63545"

      const params = {
        TableName: this.tableName,
        Key:{
          pk: `sut#${sut_id}`,
          sk: `simulationexecution#${simulation_execution_id}`
        }
      }

      const data = await this.dynamoDb.get(params).promise() 

      if(!data.Item){
        throw new ApiError({message:'simulation not found', code:404, status:'Not Found'})
      }
      return data.Item as SimulationExecutionDbData
    }

    


    private async generateUUID(){
      const myuuid = uuidv4();
      return myuuid;
    }
}