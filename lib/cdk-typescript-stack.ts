import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ApiEndpoint } from './api-endpoints';
import { init_data } from './init_data/data';
import { Permissions } from './permissions';

export class Adapter extends cdk.Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    const stage = init_data.stage
    const bucketName = `carla-connect-${stage}-adapter`
    const name = `carla_connect_${stage}_adapter`

    // create Bucket
    const bucket = new s3.Bucket(this, 'AdapterBucket', {
      bucketName: bucketName,
      // removalPolicy: cdk.RemovalPolicy.DESTROY
    } );

    // create queue
    const queue = new sqs.Queue(this, 'AdapterQueue',{ 
      fifo: true, queueName: `${name}.fifo`
    });

    //creates a dynamo db
    const dynamo_db = new dynamodb.TableV2(this, 'AdapterTable', {
        tableName:name,
        partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
        // removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    dynamo_db.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: { name: 'gsi1pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'gsi1sk', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL, 
    })

    
    const api_endpoint = new ApiEndpoint(this, "apiEnpoint")
    const results_data = api_endpoint.generate(init_data)
    

    const permissions = new Permissions(bucket, queue, dynamo_db)
    permissions.set(results_data)


   
  }
}
