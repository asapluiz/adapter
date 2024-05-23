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
        return await simulator_controller.getSimulationRunResult(
            {simulation_execution_id: pathParams.id??'', scenario_id: pathParams.scenarioId??'',
            result_id: pathParams.resultId??''}
        );

    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)