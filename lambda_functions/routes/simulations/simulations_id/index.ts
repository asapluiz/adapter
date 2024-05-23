import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { SimulationController } from '../../../modules/simulations/simulations_controller';
import { errorWrapper } from '../../../error_handler/error_wrapper';
import { ApiError } from '../../../error_handler/error_handler';
import { SimulationService } from '../../../modules/simulations/simulations_service';


const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;

    const pathParams = event.pathParameters?? {}
    let simulation_service = new SimulationService()
    let simulator_controller = new SimulationController(simulation_service);
    if (method === 'GET') {
        return await simulator_controller.getSimulationExecutionById(pathParams.id??'');

    } else if(method === 'PUT'){
        return await simulator_controller.abortSimulationExecutionById(pathParams.id??'');
    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)