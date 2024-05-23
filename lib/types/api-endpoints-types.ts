// import * as lambda from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs"
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ANY';
export type ResourceToAccess = 'db' | 'queue' | 'bucket'

export type GatewayParams = {
    url_string: string,
    method:ApiMethods
}

export type LambdaParams = {
    name: string,
    handler: string,
    asset_directory:string
}

export type Results = {
    lambda_fn:  NodejsFunction | null
    endpoint: apigateway.IResource | null
}



export type Endpoint = {
    lambda_params: LambdaParams;
    gateway_params: GatewayParams;
    results: Results;
    resource_to_access: ResourceToAccess[]
}

export type EndpointList = Endpoint[]

export type InitData = {
    stage: string;
    endpoint_list: EndpointList
}


