import destino from "@functions/destino";

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "destinoses",
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
            Action: ["ses:SendEmail"],
            Resource: "*",
          },
          {
            Effect: "Allow",
            Action: ["s3:GetObject"],
            Resource: "*",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { destino },
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
