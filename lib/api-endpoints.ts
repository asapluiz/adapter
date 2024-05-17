import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import path = require('path');
import { LambdaParams, GatewayParams, EndpointList, Results, InitData } from './types/api-endpoints-types';

export class ApiEndpoint extends Construct {
    constructor(scope: Construct, id: string){
        super(scope, id);
    }


    private lambdaFn(lambda_params:LambdaParams){
        let {name, handler, asset_directory} = lambda_params
        const lambda_function = new lambda.Function(this, name, {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: handler,
            code: lambda.Code.fromAsset(path.join(__dirname, asset_directory))
        });
        return lambda_function
    }

    private api(name:string ){
        return  new apigateway.RestApi(this, name);    
    }

    private createGateway(api:apigateway.RestApi, lambda_fn:lambda.Function, gateway_params:GatewayParams){
        let {url_string, method} = gateway_params
        const parts = url_string.split('/').filter(part => part !== '');
        let parentResource = api.root;

        for (const part of parts) {
            const existingResource = parentResource.getResource(part);
            parentResource = existingResource ?? parentResource.addResource(part);
        }

        parentResource.addMethod(method, new apigateway.LambdaIntegration(lambda_fn));
        return parentResource  
    }



    generate(init_data:InitData){
        const {stage, endpoint_list} = init_data
        const apiName = `api_${stage}`
        const api = this.api(apiName)
        let updated_endpoint_list:EndpointList = []

        for(let endpoint of endpoint_list){
            const fn = this.lambdaFn(endpoint.lambda_params)
            const url = this.createGateway(api, fn, endpoint.gateway_params)
            let results:Results = {
                lambda_fn: fn,
                endpoint: url
            }
            updated_endpoint_list.push({
                ...endpoint, results
            })
        }

        return updated_endpoint_list
       
    }


}