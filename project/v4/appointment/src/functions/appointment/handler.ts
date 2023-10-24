import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const sqs = new AWS.SQS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

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
  const {
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
    id: uuidv4(),
    name,
    age,
    medicId,
    centerId,
    specialtyId,
    subSpecialtyId,
    dateAppointment,
    countryISO,
  };

  const params: ParamsSQS = {
    MessageBody: JSON.stringify(message),
    QueueUrl: process.env[`SQS_${countryISO.toUpperCase()}_URL`],
  };

  await sqs.sendMessage(params).promise();

  const paramsDynamoDB: ICreate = {
    TableName: process.env.TABLE_NAME,
    Item: message,
  };

  await dynamodb.put(paramsDynamoDB).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Message sent",
    }),
  };
};

export const main = appointment;
