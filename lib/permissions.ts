import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { EndpointList, ResourceToAccess } from './types/api-endpoints-types';

const enum ResourceAccess{
    DB = "db",
    QUEUE = "queue",
    BUCKET = "bucket"
}

export class Permissions{
    constructor(private bucket:s3.Bucket, private queue:sqs.Queue, private db:dynamodb.TableV2){}

    set(endpoint_list:EndpointList){
        for(let endpoint of endpoint_list){
            let results = endpoint.results
            let resource_to_access = endpoint.resource_to_access
            if(!results.endpoint || !results.lambda_fn){
                throw new Error("lambda function and gateways must be set");
            }

            for(let resource of resource_to_access){
                this.selectResource(resource, results.lambda_fn)
            }
        }
    }

    selectResource(resource:ResourceToAccess, fn:lambda.Function){
        switch(resource){
            case ResourceAccess.DB:
                this.setDynamoDb(fn)
                return 
            case ResourceAccess.QUEUE:
                this.setQueue(fn)
                return
            case ResourceAccess.BUCKET:
                this.setBucket(fn)
                return
            default:
                return
        }
    }

    setBucket(fn:lambda.Function){
        this.bucket.grantReadWrite(fn);
        fn.addEnvironment('BUCKET_NAME', this.bucket.bucketName)
    }

    setQueue(fn:lambda.Function){
        this.queue.grant(fn, 'sqs:*')
        fn.addEnvironment('QUEUE_NAME', this.queue.queueName)
        fn.addEnvironment('QUEUE_URL', this.queue.queueUrl)
    }

    setDynamoDb(fn:lambda.Function){
        this.db.grantFullAccess(fn)
        fn.addEnvironment('DB_NAME', this.db.tableName)
    }
}