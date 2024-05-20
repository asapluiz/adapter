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

  validate(data: T): void | never {
    const validate = this.ajv.compile(this.schema);
    const valid = validate(data);

    if(!valid){
      const errors:string[] = validate.errors?.map(error => `${error.instancePath} ${error.message}`).filter(Boolean) || [];
      const newErrors = this.listErrors(errors);
      throw new ApiError('Validation Error', 'one or more input field have invalid data', 400, "Bad request", "", newErrors);
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
