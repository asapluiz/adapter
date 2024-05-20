import { ApiError } from "./error_handler";
import {  Handler, APIGatewayProxyEvent, APIGatewayProxyResult, } from 'aws-lambda';

export const errorWrapper = (handler: Function) => {
  return async (event: APIGatewayProxyEvent, context: any) => {
    try {
      return await handler(event, context);
    } catch (error) {
      let customError: ApiError;

      if (error instanceof ApiError) {
        customError = error;
      } else if (error instanceof Error) {
        customError = new ApiError(error.message, error.stack || '');
      } else {
        customError = new ApiError("unknown Error", JSON.stringify(error));
      }

      console.error("Custom error occurred:", customError.toJSON());
      return {
        statusCode: customError.code,
        body: JSON.stringify(customError.toJSON())
      };
    }
  };
};
