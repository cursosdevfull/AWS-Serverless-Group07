import * as AWS from "aws-sdk";

interface ICreate {
  TableName: string;
  Item: any;
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const appointmentCO = async (event) => {
  console.log(event);

  const body = JSON.parse(event.Records[0].body);

  if (body.medicId === 4) {
    const paramsUpdate = {
      TableName: "AppointmentTABLE",
      UpdateExpression: "set conditionRecord = :conditionApp",
      ExpressionAttributeValues: {
        ":conditionApp": "ERROR",
      },
      Key: {
        id: body.id,
      },
      ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(paramsUpdate).promise();

    throw new Error("Medic not found");
  }

  const params: ICreate = {
    TableName: "CoTABLE",
    Item: body,
  };

  await dynamoDb.put(params).promise();

  const paramsUpdate = {
    TableName: "AppointmentTABLE",
    UpdateExpression: "set conditionRecord = :conditionApp",
    ExpressionAttributeValues: {
      ":conditionApp": "COMPLETED",
    },
    Key: {
      id: body.id,
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(paramsUpdate).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = appointmentCO;
