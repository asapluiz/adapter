import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, Context } from 'aws-lambda';
import { SimulationController } from '../../modules/simulations/simulations_controller';
import { errorWrapper } from '../../error_handler/error_wrapper';
import simulationsSchema from '../../modules/simulations/schemas/simulations_schema';
import { simulationsData } from '../../modules/simulations/simulations_types';
import SchemaValidator from '../../validation/validator';
import { ApiError } from '../../error_handler/error_handler';
import { dummy_simulation_data } from '../../test/dummy_data';
import { SimulationService } from '../../modules/simulations/simulations_service';


const handler: Handler = async (event: APIGatewayProxyEvent, context:Context): Promise<APIGatewayProxyResult> => {
    const method = event.httpMethod;

    if (method === 'POST') {
        let simulation_validator = new SchemaValidator(simulationsSchema);
        let simulation_service = new SimulationService()
        let simulator_controller = new SimulationController(simulation_service);
        return await simulator_controller.SimulationExecutions<simulationsData>(JSON.parse(event.body?? ""), simulation_validator)

    }else {
        throw new ApiError({message:'invalid method call', code:404, status:'Bad request'})
    }  
    
}

export const wrappedHandler = errorWrapper(handler)