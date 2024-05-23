import SchemaValidator, {validateId} from "../../validation/validator";
import { SimulationService } from "./simulations_service";
import { simulationsData, SimulationScenarioConfiguration, PathParamsIds } from "./simulations_types";
import { ApiError } from "../../error_handler/error_handler";
import simulationScenarioConfigurationSchema from "./schemas/simulation_scenario_configuration_schema";



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
        const { id, pk, created_by, name, scenario_data, record_signals } = simulation_execution_data
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: id,
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
        // implement the abort simulations
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: "asass",
               
            })
        }
    }


    public async executeSimulation(
        ids:PathParamsIds,
        data:SimulationScenarioConfiguration
    ){
        const validator = new SchemaValidator(simulationScenarioConfigurationSchema)
        await validator.validate(data)
        const {simulation_execution_id, scenario_id} = ids
        //validate the input ids
        const simulation_run_id = await this.simulation_service.saveSimulationRunData(ids, data)
        const simulation_execution_data = await this.simulation_service.getSimulationExecutionData(simulation_execution_id)
        const single_scenario_data = simulation_execution_data.scenario_data.find(item => item.id === scenario_id)
        if(!single_scenario_data){throw new ApiError({message:'scenario Id does not exist', code:404, status:'Not Found'})}

        const queue_data = {
            simulation_run_id: simulation_run_id,
            simulation_execution_id: simulation_execution_id,
            scenario:single_scenario_data,
            scenario_parameters: data.parameters,
            road: data.road,
            environment_parameters: data.environment,
            odd_parameters: data.oddParameters,
            record_signals: simulation_execution_data.record_signals,
            sut_id: simulation_execution_data.pk.split('#')[1],
        }
        const queue_done =await this.simulation_service.pushToQueue(queue_data)


        return {
            statusCode: 201,
            body: JSON.stringify(simulation_run_id)
        }
    }

}
