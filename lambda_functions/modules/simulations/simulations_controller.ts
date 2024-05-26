import SchemaValidator, {validateIds} from "../../validation/validator";
import { SimulationService } from "./simulations_service";
import { simulationsData, SimulationScenarioConfiguration, PathParamsIds, SimulationRunDbData, pathSESCids, PathSERids, pathSESCRids } from "./simulations_types";
import { ApiError } from "../../error_handler/error_handler";
import simulationScenarioConfigurationSchema from "./schemas/simulation_scenario_configuration_schema";
import simulationsSchema from "./schemas/simulations_schema";



export class SimulationController {
    
    constructor(private simulation_service:SimulationService){}

    public async SimulationExecutions(add_simulation_data:simulationsData){
        const validator = new SchemaValidator(simulationsSchema)
        await validator.validate(add_simulation_data)
        let simulationExecution_id = await this.simulation_service.saveSimulationExecutionData(add_simulation_data)

        return {
            statusCode: 200,
            body: JSON.stringify(simulationExecution_id )
        }
    }

    public async getSimulationExecutionById(simulation_execution_id:string){
        await validateIds([simulation_execution_id])
        
        const simulation_execution_data = await this.simulation_service.getSimulationExecutionData(simulation_execution_id)
        const { pk, sk, createdBy, name, scenarioData, recordSignals } = simulation_execution_data
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: sk.split('#')[1],
                sutId: pk.split('#')[1],
                createdBy,
                simulationName: name,
                scenarioData, 
                recordSignals
            })
        }

    }

    public async abortSimulationExecutionById(simulation_execution_id:string){
        await validateIds([simulation_execution_id])
        await this.simulation_service.getSimulationExecutionData(simulation_execution_id)
        await this.simulation_service.removeQueueItems(simulation_execution_id)

        // update all simulation run status
        const all_simulation_execution_runs = await this.simulation_service.getAllSimulationExecutionRuns(simulation_execution_id)
        for(let run of all_simulation_execution_runs){
            await this.simulation_service.updateSimulationRunResult({simulation_execution_id, run_id:run.id}, {
                state:'ABORTED',
                id: run.id
            })
        }
        

        return {
            statusCode: 204,
            body: JSON.stringify('simulations Aborted successfully')
        }
    }


    public async executeSimulation(
        ids:pathSESCids,
        data:SimulationScenarioConfiguration
    ){ 
        const {simulation_execution_id, scenario_id} = ids
        await validateIds([simulation_execution_id, scenario_id])
        const validator = new SchemaValidator(simulationScenarioConfigurationSchema)
        await validator.validate(data)
        
        const simulation_run_id = await this.simulation_service.saveSimulationRunData(ids, data)
        const simulation_execution_data = await this.simulation_service.getSimulationExecutionData(simulation_execution_id)
        const single_scenario_data = simulation_execution_data.scenarioData.find(item => item.id === scenario_id)
        if(!single_scenario_data){throw new ApiError({message:'scenario Id does not exist', code:404, status:'Not Found'})}

        const queue_data = {
            simulation_run_id: simulation_run_id,
            simulation_execution_id: simulation_execution_id,
            scenario:single_scenario_data,
            scenario_parameters: data.parameters,
            road: data.road,
            environment_parameters: data.environment,
            odd_parameters: data.oddParameters,
            record_signals: simulation_execution_data.recordSignals,
            sut_id: simulation_execution_data.pk.split('#')[1],
        }
        await this.simulation_service.pushToQueue(queue_data)
        await this.simulation_service.updateSimulationRunResult({simulation_execution_id, run_id:simulation_run_id}, {
            state:'PROCESSING',
            id: simulation_run_id
        })


        return {
            statusCode: 201,
            body: JSON.stringify(simulation_run_id)
        }
    }

    public async getSimulationRunResult(ids:pathSESCRids){
       const  {simulation_execution_id, scenario_id, run_id} = ids
        await validateIds([simulation_execution_id, scenario_id, run_id])
        const simulation_run_result = await this.simulation_service.retrieveSimulationRunResults(ids)
        return {
            statusCode: 200,
            body: JSON.stringify(simulation_run_result)
        }
    }

    public async updateSimulationRunResult(ids:PathSERids, data:SimulationRunDbData){
        const  {simulation_execution_id, run_id} = ids
        await validateIds([simulation_execution_id, run_id])

        await this.simulation_service.updateSimulationRunResult(ids, data)
        return {
            statusCode: 204,
            body: JSON.stringify("simulation result updated successfully")
        }
    }

    public async getTraceFile(ids:PathParamsIds){

        const trace_file = await this.simulation_service.retrieveTraceFilefromBucket(ids)
        
        return {
            statusCode: 200,
            headers: {
              'Content-Type': trace_file.ContentType || 'application/octet-stream',
            },
            body: trace_file.Body?.toString('base64') || '',
            isBase64Encoded: true,
          };
    }

}
