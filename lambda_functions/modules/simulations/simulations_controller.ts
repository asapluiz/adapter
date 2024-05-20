import SchemaValidator from "../../validation/validator";


export class SimulationController<T> {
    private schema_validator:SchemaValidator<T>

    constructor(validator:SchemaValidator<T>){
        this.schema_validator = validator
    }


    public async addSimulation(add_simulation_data:T): Promise<{statusCode: number; body: string;}>{
        await this.schema_validator.validate(add_simulation_data)

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'simulations is correct no wam' }),
        }

    }

}
