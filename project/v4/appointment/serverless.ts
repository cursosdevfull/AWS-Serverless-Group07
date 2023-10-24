import appointment from "@functions/appointment";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SQS_PE_URL: "${ssm:/${self:provider.stage}/sqs/SQSPE/url}",
      SQS_MX_URL: "${ssm:/${self:provider.stage}/sqs/SQSMX/url}",
      SQS_CO_URL: "${ssm:/${self:provider.stage}/sqs/SQSCO/url}",
      TABLE_NAME: "${ssm:/${self:provider.stage}/dynamodb}",
    },
    role: "arn:aws:iam::282865065290:role/role_lambda_sqs_${self:provider.stage}",
  },
  // import the function via paths
  functions: { appointment },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
