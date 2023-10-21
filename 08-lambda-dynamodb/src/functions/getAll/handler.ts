import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface IGetAll {
  TableName: string;
}

const getAll = async (event) => {
  const params: IGetAll = {
    TableName: "StudentTable",
  };

  const elements = await dynamoDb.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(elements.Items, null, 2),
  };
};

export const main = getAll;
