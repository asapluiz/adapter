import SchemaValidator, {validateId} from "../../validation/validator";
import { SimulationService } from "./simulations_service";
import { simulationsData } from "./simulations_types";


export class SimulationController {
    
    constructor(private simulation_service:SimulationService){}

    public async SimulationExecutions<T>(add_simulation_data:T, validator:SchemaValidator<T>){
        await validator.validate(add_simulation_data)
        let simulationExecution_id = await this.simulation_service.saveSimulationExecutionData(add_simulation_data as simulationsData)

        return {
            statusCode: 200,
            body: JSON.stringify({ simulationExecution_id })
        }
    }

    public async getSimulationExecutionById(simulation_execution_id:string){
        await validateId().validate({id:simulation_execution_id})
        
        const simulation_execution_data = await this.simulation_service.getSimulationExecutionData(simulation_execution_id)
        const { sk, pk, created_by, name, scenario_data, record_signals } = simulation_execution_data
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: sk.split('#')[1],
                sutId: pk.split('#')[1],
                createdBy: created_by,
                simulationName: name,
                scenarioData: scenario_data, 
                recordSignals: record_signals
            })
        }

    }

    public async abortSimulationExecutionById(simulation_execution_id:string){
        await validateId().validate({id:simulation_execution_id})

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: "asass",
               
            })
        }
    }

}
