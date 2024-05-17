import { Handler } from 'aws-lambda';

import { SQS } from 'aws-sdk';

export const handler: Handler = async (event: any): Promise<any> => {
  const sqs = new SQS();
  const queueUrl = process.env.QUEUE_URL; // Queue URL from environment variable

  const params: SQS.SendMessageRequest = {
    MessageBody: JSON.stringify({ message: "Hello from Lambda!" }),
    QueueUrl: queueUrl?queueUrl : "",
    MessageGroupId: 'my-group-id',
    MessageDeduplicationId: 'my-group-id'
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    console.log('Message sent:', result.MessageId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Message sent successfully',
        messageId: result.MessageId,
      }),
    };
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to send message---${queueUrl}` }),
    };
  }
};
