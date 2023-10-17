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
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["events:PutEvents"],
            Resource: "*",
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
  resources: {
    Resources: {
      SQSEB: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSEB",
        },
      },
      EventBusSQSCourse: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "EventBusSQSCourse",
        },
      },
      EventRule: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: { "Fn::GetAtt": ["EventBusSQSCourse", "Name"] },
          EventPattern: {
            source: ["appointment"],
            "detail-type": ["appointment-registered"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSEB", "Arn"] },
              Id: "SQSEB",
            },
          ],
        },
      },
      EventBridgeSQSPermissions: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Statements: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["SQSEB", "Arn"] },
                Principal: {
                  Service: "events.amazonaws.com",
                },
              },
            ],
          },
          Queues: [{ Ref: "SQSEB" }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
