import hello from "@functions/hello";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "cognito-curso",
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
  },
  // import the function via paths
  functions: { hello },
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
      CognitoUserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "curso07-cognito",
          AutoVerifiedAttributes: ["email"],
          EmailVerificationSubject: "Verifique su correo",
          EmailVerificationMessage:
            "Hola, verifica tu correo usando el siguient código {####}",
        },
      },
      CognitoUserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "curso07-cognito-client",
          GenerateSecret: false,
          UserPoolId: { Ref: "CognitoUserPool" },
          ExplicitAuthFlows: [
            "ALLOW_USER_PASSWORD_AUTH",
            "ALLOW_REFRESH_TOKEN_AUTH",
            "ALLOW_USER_SRP_AUTH",
          ],
        },
      },
      CognitoIdentityPool: {
        Type: "AWS::Cognito::IdentityPool",
        Properties: {
          IdentityPoolName: "curso07-cognito-identity-pool",
          AllowUnauthenticatedIdentities: false,
          CognitoIdentityProviders: [
            {
              ClientId: { Ref: "CognitoUserPoolClient" },
              ProviderName: {
                "Fn::GetAtt": ["CognitoUserPool", "ProviderName"],
              },
            },
          ],
        },
      },

      CognitoAuthRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "cognito-auth-role-new",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Federated: "cognito-identity.amazonaws.com" },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                  StringEquals: {
                    "cognito-identity.amazonaws.com:aud": {
                      Ref: "CognitoIdentityPool",
                    },
                  },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "authenticated",
                  },
                },
              },
            ],
          },
          Policies: [
            {
              PolicyName: "cognito-auth-policy-new",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "mobileanalytics:PutEvents",
                      "cognito-sync:*",
                      "cognito-identity:*",
                    ],
                    Resource: "*",
                  },
                  {
                    Effect: "Allow",
                    Action: ["execute-api:Invoke"],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      CognitoUnauthRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "cognito-unauth-role-new",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Federated: "cognito-identity.amazonaws.com" },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                  StringEquals: {
                    "cognito-identity.amazonaws.com:aud": {
                      Ref: "CognitoIdentityPool",
                    },
                  },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated",
                  },
                },
              },
            ],
          },
          Policies: [
            {
              PolicyName: "cognito-auth-policy-new",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Deny",
                    Action: [
                      "mobileanalytics:PutEvents",
                      "cognito-sync:*",
                      "cognito-identity:*",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      CognitoIdentityPoolRoleAttachment: {
        Type: "AWS::Cognito::IdentityPoolRoleAttachment",
        Properties: {
          IdentityPoolId: { Ref: "CognitoIdentityPool" },
          Roles: {
            authenticated: { "Fn::GetAtt": ["CognitoAuthRole", "Arn"] },
            unauthenticated: { "Fn::GetAtt": ["CognitoUnauthRole", "Arn"] },
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
