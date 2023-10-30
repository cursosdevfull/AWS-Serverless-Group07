import * as AWS from "aws-sdk";

interface ICreate {
  TableName: string;
  Item: any;
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const appointmentMX = async (event) => {
  console.log(event);

  for (let index = 0; index < event.Records.length; index++) {
    const body = JSON.parse(event.Records[index].body);

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
      TableName: "MxTABLE",
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
  }

  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = appointmentMX;
