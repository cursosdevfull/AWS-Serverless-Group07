import * as AWS from "aws-sdk";

interface ICreate {
  TableName: string;
  Item: any;
}

const dynamodb = new AWS.DynamoDB.DocumentClient();

const appointmentMX = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  body.status = "REGISTERED";
  const paramsDynamoDB: ICreate = {
    TableName: process.env.TABLE_NAME,
    Item: body,
  };

  await dynamodb.put(paramsDynamoDB).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = appointmentMX;
