import { JSONSchemaType } from 'ajv';
import { simulationsData, ScenarioData } from '../simulations_types';


const scenarioData: JSONSchemaType<ScenarioData> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: "uuid" },
    content: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' }
  },
  required: ['id', 'content', 'name', 'description'],
  additionalProperties: false,
}

const simulationsSchema: JSONSchemaType<simulationsData> = {
    type: 'object',
    properties: {
      sutId:{ type: 'string', format: "uuid" },
      createdBy:{ type: 'string' },
      simulationName:{ type: 'string' },
      scenarioData:{
        type:'array',
        items: scenarioData
      },
      recordSignals: {
        type: 'array',
        items: {type: "string"}
      }
     
    },
    required: ['sutId', 'scenarioData', 'recordSignals'],
    additionalProperties: false,
  };
  
  export default simulationsSchema
  