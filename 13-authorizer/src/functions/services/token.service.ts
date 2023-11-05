import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export class TokenService {
  static createRefreshToken(): string {
    return uuidv4();
  }

  static createAccessToken(name: string, email: string): string {
    return jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
  }

  static verifyAccessToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }
}
