import test from "@functions/test";

import type { AWS } from "@serverless/typescript";
const serverlessConfiguration: AWS = {
  service: "caws07-01-lambda",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    apiGateway: {
      shouldStartNameWithService: true,
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  functions: {
    test,
  },
  package: {
    individually: true,
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      concurrency: 10,
      define: {
        "require.resolve": undefined,
      },
    },
  },
};

module.exports = serverlessConfiguration;
