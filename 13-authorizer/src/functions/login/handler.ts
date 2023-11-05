import { CryptService } from "../services/crypt.service";
import { TokenService } from "../services/token.service";
import { UserService } from "../services/user.service";

const login = async (event) => {
  const { email, password } = event.body;

  const userFound = await UserService.findUserByEmail(email);

  if (userFound) {
    const passwordMatch = await CryptService.comparePassword(
      password,
      userFound.password
    );

    if (passwordMatch) {
      const accessToken = TokenService.createAccessToken(
        userFound.name,
        userFound.email
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          accessToken,
          refreshToken: userFound.refreshToken,
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid credentials",
        }),
      };
    }
  } else {
    return {
      statusCode: 409,
      body: JSON.stringify({
        message: "Email already registered",
      }),
    };
  }
};

export const main = login;
