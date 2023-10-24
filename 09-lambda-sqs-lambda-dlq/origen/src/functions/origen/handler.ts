import * as AWS from "aws-sdk";

const sqs = new AWS.SQS();

interface SendMessageSQS {
  MessageBody: string;
  QueueUrl: string;
}

const origen = async (event) => {
  console.log("event", event);

  const body = event.body;

  const params: SendMessageSQS = {
    MessageBody: body,
    QueueUrl: process.env.SQS_QUEUE_URL,
  };

  console.log("params", params);

  await sqs.sendMessage(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "origen",
      },
      null,
      2
    ),
  };
};

export const main = origen;
