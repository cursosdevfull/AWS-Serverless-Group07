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
      TOPIC_PE_ARN: "${ssm:/${self:provider.stage}/sns/SNSTOPICPE}",
      TOPIC_CO_ARN: "${ssm:/${self:provider.stage}/sns/SNSTOPICCO}",
      TOPIC_MX_ARN: "${ssm:/${self:provider.stage}/sns/SNSTOPICMX}",
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
