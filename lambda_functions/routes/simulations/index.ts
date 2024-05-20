import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import { SimulationController } from '../../modules/simulations/simulations_controller';
import { dummy_simulation_data } from '../../test/dummy_data';
import { errorWrapper } from '../../error_handler/error_wrapper';
import simulationsSchema from '../../modules/simulations/schemas/simulations_schema';
import { simulationsData } from '../../modules/simulations/simulations_types';
import SchemaValidator from '../../validation/validator';



const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    let simulation_validator = new SchemaValidator(simulationsSchema);
    let simulator_controller = new SimulationController<simulationsData>(simulation_validator);

    return await simulator_controller.addSimulation(dummy_simulation_data);
    // const method = event.httpMethod;

    // if (method === 'POST') {
    //     return await simulationController.addSimulation(JSON.parse(event.body?? ""))

    // }else {
    //     return {
    //         statusCode: 400, 
    //         body: 'Not a valid operation'
    //     };
    // }  
    
}

export const wrappedHandler = errorWrapper(handler)