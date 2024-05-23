import { JSONSchemaType } from 'ajv';
import {
    SimulationScenarioConfiguration, 
    EnvironmentConfiguration,
    ScenarioParameters,
    OddParameters 
} from '../simulations_types';


  const environmentConfigurationSchema: JSONSchemaType<EnvironmentConfiguration> = {
    type: 'object',
    properties: {
        visibility: { type: 'number', },
        brightness: { type: 'number' },
        cloudState: { type: 'number' },
        potholes: { type: 'number' },
        precipitation: { type: 'number' },
        timeOfDay: { type: 'number' },
    },
    required: [],
    additionalProperties: false,
  }

  const scenarioParameterSchema: JSONSchemaType<ScenarioParameters> = {
    type: 'object',
    properties: {
        name: { type: 'string', },
        id: { type: 'string' },
        lower: { type: 'string' },
        upper: { type: 'string' },
        unit: { type: 'string' },
    },
    required: ['name', 'id', 'lower', 'upper', 'unit',],
    additionalProperties: false,
  }

  const oddParameterSchema: JSONSchemaType<OddParameters> = {
    type: 'object',
    properties: {
        name: { type: 'string', },
        value: { type: 'string' },
    },
    required: ['name', 'value'],
    additionalProperties: false,
  }


  const simulationScenarioConfigurationSchema: JSONSchemaType<SimulationScenarioConfiguration> = {
    type: 'object',
    properties: {
        road:{ type: 'string',  },
        environment: environmentConfigurationSchema,
        parameters:{
            type:'array',
            items: scenarioParameterSchema
        },
        oddParameters: {
            type: 'array',
            items: oddParameterSchema
        }
     
    },
    required: ['road', 'parameters', 'oddParameters'],
    additionalProperties: false,
  };
  
  export default simulationScenarioConfigurationSchema
  