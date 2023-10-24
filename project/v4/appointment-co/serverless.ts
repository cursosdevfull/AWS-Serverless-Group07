import appointmentCO from "@functions/appointment-co";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment-co",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TABLE_NAME: "${ssm:/${self:provider.stage}/dynamodb/CO}",
    },
    role: "arn:aws:iam::282865065290:role/role_lambda_sqs_${self:provider.stage}",
  },
  // import the function via paths
  functions: { appointmentCO },
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
