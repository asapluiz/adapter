import { JSONSchemaType } from 'ajv';
import { SutData } from '../sut_types';


const addSutDataSchema: JSONSchemaType<SutData> = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    signals:{
      type:'array',
      items:  {type: "string"}
    }
  },
  required: ['name', 'description'],
  additionalProperties: false,
}

  
export default addSutDataSchema
  