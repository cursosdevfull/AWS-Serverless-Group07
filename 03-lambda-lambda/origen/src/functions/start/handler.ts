import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

const start = async (event) => {
  const message = {
    action: "update",
    data: {
      username: event.body.name,
    },
  };

  const result = await lambda
    .invoke({
      FunctionName: "destino-dev-end",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(message),
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result,
    }),
  };
};

export const main = start;
