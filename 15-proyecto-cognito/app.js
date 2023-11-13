const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerName = document.getElementById("registerName");
const btnRegister = document.getElementById("btnSignUp");

const verifyEmail = document.getElementById("verifyEmail");
const verifyCode = document.getElementById("verifyCode");
const btnVerify = document.getElementById("btnVerify");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const btnLogin = document.getElementById("btnSignIn");

const POOL_DATA = {
  UserPoolId: "us-east-1_mkwOibs4T",
  ClientId: "1592o4142dk3hg5sa43pcie7gk",
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(POOL_DATA);

btnRegister.addEventListener("click", () => {
  const name = registerName.value;
  const email = registerEmail.value;
  const password = registerPassword.value;

  const attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "name",
      Value: name,
    }),
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];

  userPool.signUp(email, password, attributeList, null, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    console.log("Usuario registrado correctamente", result.user);
  });
});

btnVerify.addEventListener("click", () => {
  const email = verifyEmail.value;
  const code = verifyCode.value;

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const user = new AmazonCognitoIdentity.CognitoUser(userData);
  user.confirmRegistration(code, true, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Usuario verificado", result);
  });
});

btnLogin.addEventListener("click", () => {
  const email = loginEmail.value;
  const password = loginPassword.value;

  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
    authenticationData
  );

  console.log(authenticationDetails);

  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("Usuario autenticado correctamente", result);
      const accessToken = result.getAccessToken().getJwtToken();
      sessionStorage.setItem("accessToken", accessToken);
    },
    onFailure: (err) => console.log(err),
  });
});

AWS.config.update({
  region: "us-east-1",
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "us-east-1:a7256b52-8e44-42ee-a90e-3674bbca2adb",
    Logins: {
      "cognito-idp.us-east-1.amazonaws.com/us-east-1_mkwOibs4T":
        "eyJraWQiOiJrVithRmx3OGd2ejdibVVvWml6QW4xVXVMZzVsTDVCbTZGWnNkRUZBUDlJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1NDcxYzFjNS02ZmZkLTQ1ZTQtOTQ4My0wN2VhMGNiOTQ5ZjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ta3dPaWJzNFQiLCJjbGllbnRfaWQiOiIxNTkybzQxNDJkazNoZzVzYTQzcGNpZTdnayIsIm9yaWdpbl9qdGkiOiIxZTNiNTk5Yi00MTg3LTRiZWYtOTNiNC1jNjMyNzJlY2RmZTkiLCJldmVudF9pZCI6Ijc3ZTMxNmRjLTJiNmMtNGY0MC05ODAzLWI4YmQwMjBmODIxMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTk3NDY5MzYsImV4cCI6MTY5OTc1MDUzNiwiaWF0IjoxNjk5NzQ2OTM2LCJqdGkiOiIzZDU5MGI1Zi1hNjIwLTQ1ZDctYWQ3MC00NjFkYzg4YTBhY2IiLCJ1c2VybmFtZSI6ImN1cnNvYXdzc2VydmVybGVzc2dyb3VwMDdAZ21haWwuY29tIn0.Wpy3ocEQImIX3LzBI_PpGguDvqs7clMT9RdA-VcczqZjf0PX3tqzBnazOeeiemO5HCRPlGj7K4YQOGrB230KhApHdcaLGfA-2mPK7nSBGdGrvyGpeBWs4XYrspLYahRax5X1XtEaAQRVOO2z3tz_wt3GqilzNEaH9CDoJ3bYefBSiBUeJaeliMX8xLGUXJpNrJf6Qh7zW-JvdqzRu1-19-BT3P_kDBM0Zq6Nc3Dz6xaxwQaEb6CZVQgJcLxmfyRZcPoFMqESdCSZFy20ulKUvYA4tmzXI14XxyPz-uT_R4CLmohVUFl1KJ_hKYU3UpZVUBRGwh0kNYfj__xUEimZvA",
    },
  }),
});

const cognitoCredentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:a7256b52-8e44-42ee-a90e-3674bbca2adb",
  Logins: {
    "cognito-idp.us-east-1.amazonaws.com/us-east-1_mkwOibs4T":
      "eyJraWQiOiJrVithRmx3OGd2ejdibVVvWml6QW4xVXVMZzVsTDVCbTZGWnNkRUZBUDlJPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1NDcxYzFjNS02ZmZkLTQ1ZTQtOTQ4My0wN2VhMGNiOTQ5ZjgiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9ta3dPaWJzNFQiLCJjbGllbnRfaWQiOiIxNTkybzQxNDJkazNoZzVzYTQzcGNpZTdnayIsIm9yaWdpbl9qdGkiOiIxZTNiNTk5Yi00MTg3LTRiZWYtOTNiNC1jNjMyNzJlY2RmZTkiLCJldmVudF9pZCI6Ijc3ZTMxNmRjLTJiNmMtNGY0MC05ODAzLWI4YmQwMjBmODIxMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2OTk3NDY5MzYsImV4cCI6MTY5OTc1MDUzNiwiaWF0IjoxNjk5NzQ2OTM2LCJqdGkiOiIzZDU5MGI1Zi1hNjIwLTQ1ZDctYWQ3MC00NjFkYzg4YTBhY2IiLCJ1c2VybmFtZSI6ImN1cnNvYXdzc2VydmVybGVzc2dyb3VwMDdAZ21haWwuY29tIn0.Wpy3ocEQImIX3LzBI_PpGguDvqs7clMT9RdA-VcczqZjf0PX3tqzBnazOeeiemO5HCRPlGj7K4YQOGrB230KhApHdcaLGfA-2mPK7nSBGdGrvyGpeBWs4XYrspLYahRax5X1XtEaAQRVOO2z3tz_wt3GqilzNEaH9CDoJ3bYefBSiBUeJaeliMX8xLGUXJpNrJf6Qh7zW-JvdqzRu1-19-BT3P_kDBM0Zq6Nc3Dz6xaxwQaEb6CZVQgJcLxmfyRZcPoFMqESdCSZFy20ulKUvYA4tmzXI14XxyPz-uT_R4CLmohVUFl1KJ_hKYU3UpZVUBRGwh0kNYfj__xUEimZvA",
  },
});

cognitoCredentials.get((err) => {
  if (err) {
    console.log(err);
  }
});

/*const signer = new AWS.Signers.V4({
  service: "execute-api",
  region: "us-east-1",
  endpoint: "https://nrmxilzo61.execute-api.us-east-1.amazonaws.com",
});

const request = {
  method: "POST",
  url: "dev/hello",
  headers: {
    "Content-type": "application/json",
    "X-Amz-Date": new Date().toISOString(),
  },
};

signer.sign(request);

console.log(request.headers);*/
