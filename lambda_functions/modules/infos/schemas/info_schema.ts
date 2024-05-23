import { JSONSchemaType } from 'ajv';
import { InfoData } from '../info_types';


const infoDataSchema: JSONSchemaType<InfoData> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    numberOfParallelExecutions: { type: 'integer' },
    version:  { type: 'string' },
    requiresTestEnvironments:  { type: 'boolean' }
  },
  required: ['name', 'numberOfParallelExecutions', 'version', 'requiresTestEnvironments' ],
  additionalProperties: false,
}

  
export default infoDataSchema