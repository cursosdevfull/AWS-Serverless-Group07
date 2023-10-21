import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface IDelete {
  TableName: string;
  Key: { [key: string]: string };
}

const remove = async (event) => {
  const params = {
    TableName: "StudentTable",
    Key: {
      id: "8e5f8e6c-a45c-45fb-aad6-af083b7e7220",
    },
    ReturnValues: "ALL_OLD",
  };

  const studentDeleted = await dynamoDb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(studentDeleted.Attributes, null, 2),
  };
};

export const main = remove;
