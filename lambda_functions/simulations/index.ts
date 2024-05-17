import { Handler } from 'aws-lambda';
export const handler: Handler = async (event: any): Promise<any> => {
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'simulations' }),
    }
}