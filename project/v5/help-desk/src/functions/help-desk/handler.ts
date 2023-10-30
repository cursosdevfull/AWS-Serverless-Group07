import * as AWS from "aws-sdk";

interface ICreate {
  TableName: string;
  Item: any;
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const helpDesk = async (event) => {
  const body = JSON.parse(event.Records[0].body);

  const params: ICreate = {
    TableName: "HdTABLE",
    Item: body,
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = helpDesk;
