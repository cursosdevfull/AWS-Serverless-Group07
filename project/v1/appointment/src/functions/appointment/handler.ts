import * as AWS from "aws-sdk";

const lambda = new AWS.Lambda();

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
  const functionName = `appointment-${countryISO.toLowerCase()}-dev-appointment${countryISO.toUpperCase()}`;

  const result = await lambda
    .invoke({
      FunctionName: functionName,
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(message),
    })
    .promise();

  console.log("result", result);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: result.Payload,
    }),
  };
};

export const main = appointment;
