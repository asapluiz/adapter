import { ApiError } from "./error_handler";
import {  APIGatewayProxyEvent, Context } from 'aws-lambda';

export const errorWrapper = (handler: Function) => {
  return async (event: APIGatewayProxyEvent, context: Context) => {
    try {
      return await handler(event, context);
    } catch (error) {
      let customError: ApiError;

      if (error instanceof ApiError) {
        error.requestId = context.awsRequestId
        customError = error;
      } else if (error instanceof Error) {
        customError = new ApiError({message:error.message, cause: error.stack?? '', requestId:context.awsRequestId});
      } else {
        customError = new ApiError({message:'unknown Error', cause:JSON.stringify(error) , requestId:context.awsRequestId});
      }

      console.error("Custom error occurred:", customError.toJSON());
      return {
        statusCode: customError.code,
        body: JSON.stringify(customError.toJSON())
      };
    }
  };
};
