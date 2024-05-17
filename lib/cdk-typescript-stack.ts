import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ApiEndpoint } from './api-endpoints';
import { init_data } from './types/data';
import { Permissions } from './permissions';

export class CarlaAdapter extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const stage = init_data.stage
    const bucketName = `S3_BUCKET_${stage}`
    const sqsName = `SQS${stage}`
    const dbName = `DB${stage}`

    // create Bucket
    const bucket = new s3.Bucket(this, bucketName );

    // create queue
    const queue = new sqs.Queue(this, sqsName,{ fifo: true});

    //creates a dynamo db
    const dynamo_db = new dynamodb.TableV2(this, dbName, {
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },

    });

    console.log(init_data, "11............................................")
    const api_endpoint = new ApiEndpoint(this, "apiEnpoint")
    const results_data = api_endpoint.generate(init_data)
    console.log(results_data, "22.........................................")

    const permissions = new Permissions(bucket, queue, dynamo_db)
    permissions.set(results_data)
    console.log("qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")


    //todo_service_function.addEnvironment('TODO_DB_TABLE_NAME', todo_db.tableName);
   
  }
}
