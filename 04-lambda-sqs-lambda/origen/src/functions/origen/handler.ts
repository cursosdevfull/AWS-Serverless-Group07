import * as AWS from "aws-sdk";

const sqs = new AWS.SQS();

const origen = async (event) => {
  const body = event.body;

  const params = {
    MessageBody: body,
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/282865065290/miPrimerQueue",
  };

  console.log("params", params);
  const result = await sqs.sendMessage(params).promise();
  console.log("result", result);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "origen",
      input: event,
    }),
  };
};

export const main = origen;
