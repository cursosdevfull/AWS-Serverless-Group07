import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: "bucket-s3-event",
        event: "s3:ObjectCreated:*",
        rules: [
          {
            prefix: "uploads/",
          },
          {
            suffix: ".csv",
          },
        ],
      },
    },
  ],
};
