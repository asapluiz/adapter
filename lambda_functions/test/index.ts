import * as AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';

type testSignal =  {
    TableName: string ;
    Item: {
        pk: string;
        sk: string;
        signal_id: string;
        name: string;
    };
}
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DB_NAME;

export const handler: Handler = async (event: any): Promise<any> => {
    try {
        // Parse data from the event (e.g., from API Gateway)
        

        // Create an item to be inserted into DynamoDB
        const item:testSignal = {
            TableName: tableName?? "a",
            Item: {
                pk: "sut#67888806-d2b6-4960-80d3-b3b88bbf7688",
                sk: "signal#76ed8719-0399-4603-91d5-dbe02ab82738",
                signal_id: "76ed8719-0399-4603-91d5-dbe02ab82738",
                name: "TestSignal1"
            },
        };

        // Put the item into DynamoDB
        await dynamoDB.put(item ).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Item added successfully' }),
        };
    } catch (error) {
        console.error('Error writing to DynamoDB:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error writing to DynamoDB' }),
        };
    }
};
