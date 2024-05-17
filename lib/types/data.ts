import { InitData } from "./api-endpoints-types"
export const init_data:InitData =  {
    stage: "dev",
    endpoint_list: [
        {
            lambda_params: {
                name:"Test_Lambda",
                handler:"test.handler",
                asset_directory: '../sample-lambda-functions'
            },
    
            gateway_params: {
                url_string: '/users/dogs',
                method:"GET", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: []
        },
    
        {
            lambda_params: {
                name:"Test_Lambda2",
                handler:"test.handler",
                asset_directory: '../sample-lambda-functions'
            },
    
            gateway_params: {
                url_string: '/users/cats',
                method:"GET", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
            
            resource_to_access: ["db", "queue", "bucket"]
    
    
        },
    
    
    ]
}

