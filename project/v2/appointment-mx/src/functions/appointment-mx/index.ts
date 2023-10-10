import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [{ sqs: { arn: "${ssm:/${self:provider.stage}/sqs/SQSMX/arn}" } }],
};
