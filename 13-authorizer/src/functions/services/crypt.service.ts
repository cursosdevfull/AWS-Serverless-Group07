import * as crypt from "bcryptjs";

export class CryptService {
  static async hashPassword(password: string): Promise<string> {
    const salt = 10;
    return await crypt.hash(password, salt);
  }

  static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await crypt.compare(password, hash);
  }
}
