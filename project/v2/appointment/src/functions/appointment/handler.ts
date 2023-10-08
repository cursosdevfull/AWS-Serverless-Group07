import * as AWS from "aws-sdk";

const sqs = new AWS.SQS();

interface ParamsSQS {
  MessageBody: string;
  QueueUrl: string;
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

  const result = await sqs.sendMessage(params).promise();

  console.log("result", result);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Message sent",
    }),
  };
};

export const main = appointment;
