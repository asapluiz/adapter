import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Md5 } from 'ts-md5';
import { 
  simulationsData, 
  SimulationExecutionDbData, 
  SimulationScenarioConfiguration, 
  PathParamsIds,
  QueueData,
  SimulationRunDbData 
} from "./simulations_types";
import { ApiError } from '../../error_handler/error_handler';

const SUTID = "a3364909-73dd-4095-962a-eff1bad63545"
/// come back and get the sut id the right way
export class SimulationService{
    private tableName:string = process.env.DB_NAME || ''
    private queueUrl: string = process.env.QUEUE_URL || ''
    private dynamoDb = new AWS.DynamoDB.DocumentClient();
    private sqs = new AWS.SQS();

    

    public async saveSimulationExecutionData(data:simulationsData ){
        const simulation_execution_id = await this.generateUUID()
        const params = {
            TableName: this.tableName,
            Item: {
              pk: `sut#${data.sutId}`,
              sk: `simulationexecution#${simulation_execution_id}`,
              id: `${simulation_execution_id}`,
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
      let sut_id = SUTID

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

    public async saveSimulationRunData(ids:PathParamsIds, data:SimulationScenarioConfiguration){
      const sut_id = SUTID
      const simulation_run_id = await this.generateUUID()
        const params = {
            TableName: this.tableName,
            Item: {
              pk: `sut#${sut_id}`,
              sk: `simulationexecution#${ids.simulation_execution_id}#simulationrun#${simulation_run_id}`,
              id: `${simulation_run_id}`,
              scenarioId: `${ids.scenario_id}`,
              road: data.road,
              environment: data.environment,
              oddParameters: data.oddParameters,
              parameters: data.parameters,
              state: 'pending',
            },
            ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
        };
        await this.dynamoDb.put(params).promise();
        
        return simulation_run_id
    }

    public async updateSimulationRunResult(ids:PathParamsIds, data:SimulationRunDbData){
      const sut_id = SUTID
      let updateExpression = 'SET';
      const expressionAttributeNames:any = {};
      const expressionAttributeValues:any = {};

      for (const [key, value] of Object.entries(data)) {
        updateExpression += ` #${key} = :${key},`;
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
      updateExpression = updateExpression.slice(0, -1);

      const params = {
        TableName: this.tableName,
        Key: { 
          pk: `sut#${sut_id}`,
          sk: `simulationexecution#${ids.simulation_execution_id}#simulationrun#${ids.result_id}`
         },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await this.dynamoDb.update(params).promise();
      return result
    }

    public async pushToQueue(data:QueueData){

      const duplication_id = Md5.hashStr(JSON.stringify(data)).toString()
      const params = {
        MessageBody: JSON.stringify(data), 
        QueueUrl: this.queueUrl, 
        MessageDeduplicationId:duplication_id,
        MessageGroupId: duplication_id
      };

      await this.sqs.sendMessage(params).promise()
      return duplication_id
    }
    

    public async retrieveSimulationRunResults(ids:PathParamsIds){
      let sut_id = SUTID

      const params = {
        TableName: this.tableName,
        Key:{
          pk: `sut#${sut_id}`,
          sk: `simulationexecution#${ids.simulation_execution_id}#simulationrun#${ids.result_id}`
        }
      }

      const data = await this.dynamoDb.get(params).promise() 

      if(!data.Item){
        throw new ApiError({message:'Simulation result not found', code:404, status:'Not Found'})
      }
      return data.Item as SimulationRunDbData
    }
    

    public async removeQueueItems(id:string){
      const allMessages = await this.fetchAllQueueMessages();

      if (allMessages.length > 0) {
        await this.deleteMarkedQueueMessages(allMessages, id);
      }
      return 
    }

    private async fetchAllQueueMessages(): Promise<AWS.SQS.Message[]> {
      let allMessages: AWS.SQS.Message[] = [];
      let moreMessagesExist = true;
    
      while (moreMessagesExist) {
        const messages = await this.fetchQueueMessages();
        if (messages.length > 0) {
          allMessages = allMessages.concat(messages);
        }
        moreMessagesExist = messages.length === 10;
      }
    
      return allMessages;
    }

    private async fetchQueueMessages(): Promise<AWS.SQS.Message[]> {
      const params = {
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 20,
        WaitTimeSeconds: 0,
      };
    
      const result = await this.sqs.receiveMessage(params).promise();
      return result.Messages || [];
    }

    private async deleteMarkedQueueMessages(messages: AWS.SQS.Message[], id:string) {
      const deleteParams = {
        QueueUrl: this.queueUrl,
        Entries: messages
          .filter(message => message.Body?.includes(id))
          .map(message => ({
            Id: message.MessageId!,
            ReceiptHandle: message.ReceiptHandle!,
          })),
      };
     
      if (deleteParams.Entries.length > 0) {
        await this.sqs.deleteMessageBatch(deleteParams).promise();
      }

      return
    }

    private async generateUUID(){
      const myuuid = uuidv4();
      return myuuid;
    }
}

