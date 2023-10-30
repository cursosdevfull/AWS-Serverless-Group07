import receive from "@functions/receive";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "lambdas3",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["s3:GetObject"],
            Resource: ["arn:aws:s3:::bucket-s3-event/*"],
          },
          {
            Effect: "Allow",
            Action: ["dynamodb:PutItem"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { receive },
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
  resources: {
    Resources: {
      MedicTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "MedicTable",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
