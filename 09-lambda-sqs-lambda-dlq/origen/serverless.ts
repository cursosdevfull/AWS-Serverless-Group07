import origen from "@functions/origen";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "origen",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SQS_QUEUE_URL:
        "https://sqs.us-east-1.amazonaws.com/282865065290/SQS_Origen",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "arn:aws:sqs:us-east-1:282865065290:SQS_Origen",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { origen },
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
