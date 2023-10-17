import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        eventBus: "BUS_COURSE",
        pattern: {
          source: ["appointment"],
          "detail-type": ["appointment-cancelled"],
        },
      },
    },
  ],
};
