import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { ApiError } from '../error_handler/error_handler';
import { ApiPartialError } from '../types/error_types';

class SchemaValidator<T> {
  private ajv: Ajv;
  private schema: JSONSchemaType<T>;

  constructor(schema: JSONSchemaType<T>) {
    this.ajv = new Ajv();
    addFormats(this.ajv);
    this.schema = schema;
  }

  public async validate(data: T): Promise<void | never> {
    const validate = await this.ajv.compile(this.schema);
    const valid = await validate(data);

    if(!valid){
      const errors:string[] = validate.errors?.map(error => `${error.instancePath} ${error.message}`).filter(Boolean) || [];
      const newErrors = this.listErrors(errors);
      throw new ApiError({message:'Validation Error', code:400, status:'Bad request', errors:newErrors});
    }
  }

  private listErrors(errors:string[]):ApiPartialError[] {
    
    const newErrorList = errors.map(item=>({
      code: 422,
      detail: "",
      message: item,
      status: 'Unprocessable Entity',
    }))

    return newErrorList
  }
}



export default SchemaValidator;


export async function validateIds(idList:string[]){
  const idSchema: JSONSchemaType<{id:string}> = {
    type: 'object',
    properties: {
      id: { type: 'string', format: "uuid" },
    },
    required: ['id'],
    additionalProperties: false,
  }

  for(let id of idList){
    const validation = new SchemaValidator(idSchema)
    await validation.validate({id})
  }
  return
}
