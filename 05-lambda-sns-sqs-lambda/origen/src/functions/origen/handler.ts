import * as AWS from "aws-sdk";

const sns = new AWS.SNS();

interface SendMessageSNS {
  Message: string;
  TopicArn: string;
}

const origen = async (event) => {
  const body = event.body;

  const params: SendMessageSNS = {
    Message: body,
    TopicArn: "arn:aws:sns:us-east-1:282865065290:SNSTOPIC",
  };

  const results = await sns.publish(params).promise();
  console.log(results);

  return {
    statusCode: 200,
    body: "message sent",
  };
};

export const main = origen;
