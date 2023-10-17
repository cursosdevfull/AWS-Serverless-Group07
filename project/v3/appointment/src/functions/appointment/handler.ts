import * as AWS from "aws-sdk";

const sns = new AWS.SNS();

interface SendMessageSNS {
  Message: string;
  TopicArn: string;
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

  const params: SendMessageSNS = {
    Message: JSON.stringify(message),
    TopicArn: process.env[`TOPIC_${countryISO.toUpperCase()}_ARN`],
  };

  const result = await sns.publish(params).promise();

  console.log("result2", result);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Message sent",
    }),
  };
};

export const main = appointment;
