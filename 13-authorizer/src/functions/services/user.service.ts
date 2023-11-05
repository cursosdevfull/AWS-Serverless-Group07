import * as AWS from "aws-sdk";

import { TokenService } from "./token.service";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class UserService {
  static async findUserByEmail(email: string) {
    const params = {
      TableName: "users",
      Key: { email },
    };

    const result = await dynamoDb.get(params).promise();
    return result.Item;
  }

  static async register(name: string, email: string, password: string) {
    const params = {
      TableName: "users",
      Item: {
        name,
        email,
        password,
        refreshToken: TokenService.createRefreshToken(),
        createdAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();
  }
}
