import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "infrastructure",
  frameworkVersion: "3",
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {},
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
      // PE
      SQSPE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSPE-${self:provider.stage}",
          MessageRetentionPeriod: 1209600,
          VisibilityTimeout: 30,
        },
      },
      SSMSQSPEURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSPE/url",
          Type: "String",
          Value: { Ref: "SQSPE" },
        },
      },
      SSMSQSPEARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSPE/arn",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSPE", "Arn"] },
        },
      },
      SNSTOPICPE: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTOPICPE-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSPE", "Arn"] },
            },
          ],
        },
      },
      SSMTOPICPE: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sns/SNSTOPICPE",
          Type: "String",
          Value: { Ref: "SNSTOPICPE" },
        },
      },
      SQSQUEUEPOLICYPE: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSPE" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: "*",
                Principal: "*",
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTOPICPE" },
                  },
                },
              },
            ],
          },
        },
      },
      // CO
      SQSCO: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSCO-${self:provider.stage}",
          MessageRetentionPeriod: 1209600,
          VisibilityTimeout: 30,
        },
      },
      SSMSQSCOURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSCO/url",
          Type: "String",
          Value: { Ref: "SQSCO" },
        },
      },
      SSMSQSCOARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSCO/arn",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSCO", "Arn"] },
        },
      },
      SNSTOPICCO: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTOPICCO-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSCO", "Arn"] },
            },
          ],
        },
      },
      SSMTOPICCO: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sns/SNSTOPICCO",
          Type: "String",
          Value: { Ref: "SNSTOPICCO" },
        },
      },
      SQSQUEUEPOLICYCO: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSCO" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: "*",
                Principal: "*",
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTOPICCO" },
                  },
                },
              },
            ],
          },
        },
      },
      // MX
      SQSMX: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSMX-${self:provider.stage}",
          MessageRetentionPeriod: 1209600,
          VisibilityTimeout: 30,
        },
      },
      SSMSQSMXURL: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSMX/url",
          Type: "String",
          Value: { Ref: "SQSMX" },
        },
      },
      SSMSQSMXARN: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sqs/SQSMX/arn",
          Type: "String",
          Value: { "Fn::GetAtt": ["SQSMX", "Arn"] },
        },
      },
      SNSTOPICMX: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTOPICMX-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSMX", "Arn"] },
            },
          ],
        },
      },
      SSMTOPICMX: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/sns/SNSTOPICMX",
          Type: "String",
          Value: { Ref: "SNSTOPICMX" },
        },
      },
      SQSQUEUEPOLICYMX: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSMX" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: "*",
                Principal: "*",
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTOPICMX" },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
