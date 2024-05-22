import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { errorWrapper } from '../../error_handler/error_wrapper';
import SchemaValidator from '../../validation/validator';
import { InfoController } from '../../modules/infos/info_controller';
import { InfoService } from '../../modules/infos/info_service';
import { ApiError } from '../../error_handler/error_handler';
import infoDataSchema from '../../modules/infos/schemas/info_schema';
import { InfoData } from '../../modules/infos/info_types';
import { dummy_info_data } from '../../test/dummy_data';



const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {

    
    // const simulation_validator = new SchemaValidator(infoDataSchema);
    // const info_service = new InfoService
    // const info_controller = new InfoController(info_service)

    // return await info_controller.updateInfo<InfoData>( dummy_info_data, simulation_validator)
    // ..............................................................................
    const method = event.httpMethod;
    const info_service = new InfoService

    if (method === 'POST') { 
        const simulation_validator = new SchemaValidator(infoDataSchema);
        const info_controller = new InfoController(info_service)

        return await info_controller.updateInfo<InfoData>( JSON.parse(event.body?? ""), simulation_validator)
    }else if(method === 'GET'){
        const info_controller = new InfoController(info_service)
        return await info_controller.getInfo()
    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)