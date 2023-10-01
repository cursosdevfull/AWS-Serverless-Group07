import { handlerPath } from "@libs/handler-resolve";

export default {
  handler: `${handlerPath(__dirname)}/handler.testHandler`,
  events: [
    {
      http: {
        path: "test",
        method: "post",
      },
    },
  ],
};
