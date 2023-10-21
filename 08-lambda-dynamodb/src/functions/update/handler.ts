import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const update = async (event) => {
  const params = {
    TableName: "StudentTable",
    UpdateExpression: "set firstname = :firstname, lastname = :lastname",
    ExpressionAttributeValues: {
      ":firstname": "Claudia",
      ":lastname": "Luna",
    },
    Key: {
      id: "8e5f8e6c-a45c-45fb-aad6-af083b7e7220",
    },
    ReturnValues: "ALL_NEW",
  };

  const studentUpdated = await dynamoDb.update(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(studentUpdated.Attributes, null, 2),
  };
};

export const main = update;
