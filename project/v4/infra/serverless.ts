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
      APPOINTMENT: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Appointment-${self:provider.stage}",
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
      SSMDYNAMO: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/dynamodb",
          Type: "String",
          Value: { Ref: "APPOINTMENT" },
        },
      },
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
      APPOINTMENTPE: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Appointment-${self:provider.stage}-PE",
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
      SSMDYNAMOPE: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/dynamodb/PE",
          Type: "String",
          Value: { Ref: "APPOINTMENTPE" },
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
      APPOINTMENTCO: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Appointment-${self:provider.stage}-CO",
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
      SSMDYNAMOCO: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/dynamodb/CO",
          Type: "String",
          Value: { Ref: "APPOINTMENTCO" },
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
      APPOINTMENTMX: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Appointment-${self:provider.stage}-MX",
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
      SSMDYNAMOMX: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/${self:provider.stage}/dynamodb/MX",
          Type: "String",
          Value: { Ref: "APPOINTMENTMX" },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
