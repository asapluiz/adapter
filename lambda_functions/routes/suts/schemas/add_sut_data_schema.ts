import { JSONSchemaType } from 'ajv';
import { SutData } from '../../../modules/suts/sut_types';


const addSutDataSchema: JSONSchemaType<SutData> = {
  type: 'object',
  properties: {
    id: { type: 'string', format: "uuid" },
    name: { type: 'string' },
    description: { type: 'string' },
    signals:{
      type:'array',
      items:  {type: "string"}
    }
  },
  required: ['id', 'name', 'description'],
  additionalProperties: false,
}

  
export default addSutDataSchema
  