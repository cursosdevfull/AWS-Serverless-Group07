import { PolicyService } from "@functions/services/policy.service";

import { TokenService } from "../services/token.service";

const authorizer = async (event) => {
  const { authorizationToken, methodArn } = event;

  try {
    const payload = await TokenService.verifyAccessToken(authorizationToken);
    return PolicyService.generate("user", "Allow", methodArn);
  } catch (error) {
    return PolicyService.generate("user", "Deny", methodArn);
  }
};

export const main = authorizer;
