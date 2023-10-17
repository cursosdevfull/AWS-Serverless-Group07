import * as AWS from "aws-sdk";

const eventBridge = new AWS.EventBridge();

interface SendMessageEventBridge {
  Entries: [
    {
      Source: string;
      DetailType: string;
      Detail: string;
      EventBusName: string;
    }
  ];
}

const origen = async (event) => {
  const body = event.body;
  console.log("body", body);

  const params: SendMessageEventBridge = {
    Entries: [
      {
        Source: "appointment",
        DetailType: "appointment-cancelled",
        Detail: JSON.stringify({ message: body }),
        EventBusName: "BUS_COURSE",
      },
    ],
  };

  console.log("params", params);

  await eventBridge.putEvents(params).promise();

  return {
    statusCode: 200,
    body: "ok",
  };
};

export const main = origen;
