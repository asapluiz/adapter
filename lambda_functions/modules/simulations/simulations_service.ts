import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Md5 } from 'ts-md5';
import { 
  simulationsData, 
  SimulationExecutionDbData, 
  SimulationScenarioConfiguration, 
  QueueData,
  SimulationRunDbData,
  pathSESCids, PathSERids, pathSESCRids 
} from "./simulations_types";
import { ApiError } from '../../error_handler/error_handler';


export class SimulationService{
    private tableName:string = process.env.DB_NAME || ''
    private queueUrl: string = process.env.QUEUE_URL || ''
    private dynamoDb = new AWS.DynamoDB.DocumentClient();
    private sqs = new AWS.SQS();
    private bucketName = process.env.BUCKET_NAME || '';
    private s3 = new AWS.S3();

    

    public async saveSimulationExecutionData(data:simulationsData ){
        const simulation_execution_id = await this.generateUUID()
        const params = {
            TableName: this.tableName,
            Item: {
              pk: `sut#${data.sutId}`,
              sk: `simulationexecution#${simulation_execution_id}`,
              gsi1pk: `simulationexecution#${simulation_execution_id}`,
              gsi1sk: `simulationexecution#${simulation_execution_id}`,
              id: `${simulation_execution_id}`,
              name: data.simulationName,
              createdBy: data.createdBy,
              scenarioData: data.scenarioData,
              recordSignals: data.recordSignals
            },
            ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
          };
        await this.dynamoDb.put(params).promise();
        
        return simulation_execution_id
    }

    public async getSimulationExecutionData(simulation_execution_id:string){
      const params = {
        TableName: this.tableName,
        IndexName:'gsi1',
        KeyConditionExpression: 'gsi1pk = :gsi1pk AND gsi1sk = :gsi1sk',
        ExpressionAttributeValues: {
          ':gsi1pk': `simulationexecution#${simulation_execution_id}`,
          ':gsi1sk': `simulationexecution#${simulation_execution_id}`
        }
      }

      const data = await this.dynamoDb.query(params).promise() 

      if(!data.Items || data.Items.length === 0){
        throw new ApiError({message:'simulation not found', code:404, status:'Not Found'})
      }
      return data.Items[0] as SimulationExecutionDbData
    }

    public async saveSimulationRunData(ids:pathSESCids, data:SimulationScenarioConfiguration){
      const simulation_run_id = await this.generateUUID()
        const params = {
            TableName: this.tableName,
            Item: {
              pk: `simulationrun#${simulation_run_id}`,
              sk: `simulationrun#${simulation_run_id}`,
              gsi1pk: `simulationexecution#${ids.simulation_execution_id}`,
              gsi1sk: `simulationrun#${simulation_run_id}`,
              id: `${simulation_run_id}`,
              scenarioId: `${ids.scenario_id}`,
              road: data.road,
              environment: data.environment,
              oddParameters: data.oddParameters,
              parameters: data.parameters,
              state: 'PENDING',
            },
            ConditionExpression: 'attribute_not_exists(pk) AND attribute_not_exists(sk)'
        };
        await this.dynamoDb.put(params).promise();
        
        return simulation_run_id
    }


    public async getAllSimulationExecutionRuns(simulation_execution_id:string){
      const params = {
        TableName: this.tableName,
        IndexName:'gsi1',
        KeyConditionExpression: 'gsi1pk = :gsi1pk AND begins_with(gsi1sk, :gsi1skPrefix)',
        ExpressionAttributeValues: {
          ':gsi1pk': `simulationexecution#${simulation_execution_id}`,
          ':gsi1skPrefix': 'simulationrun#'
        }
      }

      const data = await this.dynamoDb.query(params).promise()

      return data.Items as SimulationRunDbData[]?? [] 
    }

    public async updateSimulationRunResult(ids:PathSERids, data:SimulationRunDbData){
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
          pk: `simulationrun#${ids.run_id}`,
          sk: `simulationrun#${ids.run_id}`
         },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
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
    

    public async retrieveSimulationRunResults(ids:pathSESCRids){
      const params = {
        TableName: this.tableName,
        IndexName:'gsi1',
        KeyConditionExpression: 'gsi1pk = :gsi1pk AND gsi1sk = :gsi1sk',
        ExpressionAttributeValues: {
          ':gsi1pk': `simulationexecution#${ids.simulation_execution_id}`,
          ':gsi1sk': `simulationrun#${ids.run_id}`
        }
      }

      const data = await this.dynamoDb.query(params).promise() 

      if(!data.Items || data.Items.length === 0){
        throw new ApiError({message:'simulation not found', code:404, status:'Not Found'})
      }
      return data.Items[0] as SimulationRunDbData
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

      // we can only delete 10 items at a time
      while(deleteParams.Entries.length !== 0){ 
        const removedItems = deleteParams.Entries.splice(0, 10);

        await this.sqs.deleteMessageBatch({
          QueueUrl: this.queueUrl,
          Entries: removedItems
        }).promise();
      }

      return
    }

    public async retrieveTraceFilefromBucket(ids:pathSESCRids){
      const trace_file_key = `${ids.run_id}/results/trace.mf4`
      const data = await this.s3.getObject({ Bucket: this.bucketName, Key: trace_file_key }).promise();
      return data
    }

    private async generateUUID(){
      const myuuid = uuidv4();
      return myuuid;
    }
}

