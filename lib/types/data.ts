import { InitData } from "./api-endpoints-types"
export const init_data:InitData =  {
    stage: "dev",
    endpoint_list: [
        {
            lambda_params: {
                name:"infos",
                handler:"index.handler",
                asset_directory: '../lambda_functions/infos/index.ts'
            },
    
            gateway_params: {
                url_string: '/infos',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"suts",
                handler:"index.handler",
                asset_directory: '../lambda_functions/suts/index.ts'
            },
    
            gateway_params: {
                url_string: '/suts',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"suts_id",
                handler:"index.handler",
                asset_directory: '../lambda_functions/suts_id/index.ts'
            },
    
            gateway_params: {
                url_string: '/suts/{id}',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"suts_id_signals",
                handler:"index.handler",
                asset_directory: '../lambda_functions/suts_id_signals/index.ts'
            },
    
            gateway_params: {
                url_string: '/suts/{id}/signals',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"simulations",
                handler:"index.handler",
                asset_directory: '../lambda_functions/simulations/index.ts'
            },
    
            gateway_params: {
                url_string: '/simulations',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"simulations_id",
                handler:"index.handler",
                asset_directory: '../lambda_functions/simulations_id/index.ts'
            },
    
            gateway_params: {
                url_string: '/simulations/{id}',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db", "queue"]
        },
        
        {
            lambda_params: {
                name:"simulations_id_scenarioid",
                handler:"index.handler",
                asset_directory: '../lambda_functions/simulations_id_scenarioid/index.ts'
            },
    
            gateway_params: {
                url_string: '/simulations/{id}/scenarios/{scenarioId}/execute',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db", "queue"]
        },

        {
            lambda_params: {
                name:"simulations_id_scenarioid_resultid",
                handler:"index.handler",
                asset_directory: '../lambda_functions/simulations_id_scenarioid_resultid/index.ts'
            },
    
            gateway_params: {
                url_string: '/simulations/{id}/scenarios/{scenarioId}/results/{resultId}',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db"]
        },

        {
            lambda_params: {
                name:"simulations_id_scenarioid_resultid_trace",
                handler:"index.handler",
                asset_directory: '../lambda_functions/simulations_id_scenarioid_resultid_trace/index.ts'
            },
    
            gateway_params: {
                url_string: '/simulations/{id}/scenarios/{scenarioId}/results/{resultId}/trace',
                method:"ANY", 
                
            },
    
            results: {
                lambda_fn: null,
                endpoint: null
            },
    
            resource_to_access: ["db", "bucket"]
        }
    ]
}

