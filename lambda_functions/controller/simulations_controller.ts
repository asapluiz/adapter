import SchemaValidator from "../validation/validator";
import simulationsSchema from "../schemas/simulations_schema";
import { simulationsData } from "../types/simulations_types";


export const simulationController = {
    async addSimulation(simulation_data:simulationsData ): Promise<{statusCode: number; body: string;}>{
        const simulation_validator = new SchemaValidator(simulationsSchema)
        simulation_validator.validate(simulation_data);
        






        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'simulations is correct no wam' }),
        }
    
    }

}
