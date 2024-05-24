import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { errorWrapper } from '../../error_handler/error_wrapper';
import { InfoController } from '../../modules/infos/info_controller';
import { InfoService } from '../../modules/infos/info_service';
import { ApiError } from '../../error_handler/error_handler';


const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;
    const info_service = new InfoService

    if (method === 'POST') { 
        if(!event.body){
            throw new ApiError({message:'request must have a body', code:400, status:'Bad request'})
        }
        const info_controller = new InfoController(info_service)
        return await info_controller.updateInfo(JSON.parse(event.body))
    }else if(method === 'GET'){
        const info_controller = new InfoController(info_service)
        return await info_controller.getInfo()
    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)