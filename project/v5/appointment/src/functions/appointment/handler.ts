import * as AWS from "aws-sdk";

const sqs = new AWS.SQS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

interface ParamsSQS {
  MessageBody: string;
  QueueUrl: string;
}

interface ICreate {
  TableName: string;
  Item: any;
}

const appointment = async (event) => {
  const obj = JSON.parse(event.body);
  console.log("obj", obj);

  const {
    id,
    name,
    age,
    medicId,
    centerId,
    specialtyId,
    subSpecialtyId,
    dateAppointment,
    countryISO,
  } = obj;

  const message = {
    id,
    name,
    age,
    medicId,
    centerId,
    specialtyId,
    subSpecialtyId,
    dateAppointment,
    countryISO,
    conditionRecord: "REGISTERED",
  };

  console.log("message", message);

  const paramsDb: ICreate = {
    TableName: "AppointmentTABLE",
    Item: message,
  };

  console.log("paramsDb", paramsDb);
  await dynamoDb.put(paramsDb).promise();

  const params: ParamsSQS = {
    MessageBody: JSON.stringify(message),
    QueueUrl: process.env[`SQS_${countryISO.toUpperCase()}_URL`],
  };

  console.log("params", params);
  await sqs.sendMessage(params).promise();

  const paramsUpdate = {
    TableName: "AppointmentTABLE",
    UpdateExpression: "set conditionRecord = :conditionApp",
    ExpressionAttributeValues: {
      ":conditionApp": "QUEUED",
    },
    Key: {
      id,
    },
    ReturnValues: "ALL_NEW",
  };

  console.log("paramsUpdate", paramsUpdate);

  //await dynamoDb.update(paramsUpdate).promise();

  console.log("db updated");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Message sent",
    }),
  };
};

export const main = appointment;
