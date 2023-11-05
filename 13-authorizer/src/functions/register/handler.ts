import { CryptService } from "../services/crypt.service";
import { UserService } from "../services/user.service";

const register = async (event) => {
  const { name, email, password } = event.body;

  const userFound = await UserService.findUserByEmail(email);

  if (!userFound) {
    const passwordHash = await CryptService.hashPassword(password);
    await UserService.register(name, email, passwordHash);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User registered successfully",
      }),
    };
  } else {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: "Email already registered",
      }),
    };
  }
};

export const main = register;
