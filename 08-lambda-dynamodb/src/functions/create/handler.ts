import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface ICreate {
  TableName: string;
  Item: any;
}
const create = async (event) => {
  const record = {
    id: uuid(),
    firstname: "Adriana",
    lastname: "Gutierrez",
    createAt: new Date().toISOString(),
    countryISO: "PE",
  };

  const params: ICreate = {
    TableName: "StudentTable",
    Item: record,
  };

  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "create",
      },
      null,
      2
    ),
  };
};

export const main = create;
