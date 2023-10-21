import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface IGetOne {
  TableName: string;
  Key: { [key: string]: string };
}

const getOne = async (event) => {
  const params = {
    TableName: "StudentTable",
    Key: {
      id: "8e5f8e6c-a45c-45fb-aad6-af083b7e7220",
    },
    AttributesToGet: ["firstname", "lastname"],
  };

  const element = await dynamoDb.get(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(element.Item, null, 2),
  };
};

export const main = getOne;
