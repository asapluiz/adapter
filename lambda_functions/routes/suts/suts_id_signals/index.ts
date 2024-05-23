import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { errorWrapper } from '../../../error_handler/error_wrapper';
import { ApiError } from '../../../error_handler/error_handler';
import { SutController } from '../../../modules/suts/sut_controller';
import { SutService } from '../../../modules/suts/sut_service';

const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;
    const pathParams = event.pathParameters?? {}
    const sut_service = new SutService()

    if (method === 'GET') { 
        const sut_controller = new SutController(sut_service)
        return await sut_controller.getSutSignals(pathParams.id?? '')
    }
    else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)