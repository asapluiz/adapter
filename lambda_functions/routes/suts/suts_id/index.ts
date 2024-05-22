import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { errorWrapper } from '../../../error_handler/error_wrapper';
import { ApiError } from '../../../error_handler/error_handler';
import { SutController } from '../../../modules/suts/sut_controller';
import { SutService } from '../../../modules/suts/sut_service';
import { dummy_sut_data } from '../../../test/dummy_data';
import addSutDataSchema from '../schemas/add_sut_data_schema';
import SchemaValidator from '../../../validation/validator';



const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {

    // const pathParams = event.pathParameters?? {}
    // //const simulation_validator = new SchemaValidator(addSutDataSchema);
    // const sut_service = new SutService()
    // const sut_controller = new SutController(sut_service)

    // return await sut_controller.getSutById(pathParams.id?? '')
    // ..............................................................................
    const method = event.httpMethod;


    const pathParams = event.pathParameters?? {}

    const sut_service = new SutService()

    if (method === 'GET') { 
        const sut_controller = new SutController(sut_service)
    
        return await sut_controller.getSutById(pathParams.id?? '')
    }
    else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)