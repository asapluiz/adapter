import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { errorWrapper } from '../../error_handler/error_wrapper';
import { ApiError } from '../../error_handler/error_handler';
import { SutController} from '../../modules/suts/sut_controller';
import { SutService } from '../../modules/suts/sut_service';
import { dummy_sut_data } from '../../test/dummy_data';
import { SutData } from '../../modules/suts/sut_types';
import addSutDataSchema from './schemas/add_sut_data_schema';
import SchemaValidator from '../../validation/validator';



const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;
    const sut_service = new SutService()

    if (method === 'POST') {
        const simulation_validator = new SchemaValidator(addSutDataSchema);
        const sut_controller = new SutController(sut_service)

        return await sut_controller.addSuts<SutData>(JSON.parse(event.body?? ""), simulation_validator)
    } else if (method === 'GET'){
        const sut_controller = new SutController(sut_service)

        return await sut_controller.getSuts()
    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)