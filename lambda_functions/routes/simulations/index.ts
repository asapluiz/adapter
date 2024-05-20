import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { simulationController } from '../../controller/simulations_controller';
import { dummy_simulation_data } from '../../test/dummy_data';
import { errorWrapper } from '../../error_handler/error_wrapper';


const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return await simulationController.addSimulation(dummy_simulation_data)
    const method = event.httpMethod;

    if (method === 'POST') {
        return await simulationController.addSimulation(JSON.parse(event.body?? ""))

    }else {
        return {
            statusCode: 400, 
            body: 'Not a valid operation'
        };
    }  
    
}

export const wrappedHandler = errorWrapper(handler)