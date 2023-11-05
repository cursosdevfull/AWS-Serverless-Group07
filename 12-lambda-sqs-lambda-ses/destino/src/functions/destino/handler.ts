import * as AWS from "aws-sdk";
import * as velocityjs from "velocityjs";

const ses = new AWS.SES();
const s3 = new AWS.S3();

interface ParametersEmail {
  nameOfBucket: string;
  nameOfTemplate: string;
  subject: string;
  source: string;
  destination: string[];
  paramsBody: Record<string, any>;
}

const getParameters = (body: Record<string, any>): ParametersEmail => {
  const nameOfBucket = body.template.nameOfBucket;
  const nameOfTemplate = body.template.nameOfTemplate;
  const subject = body.subject;
  const source = body.from;
  const destination = body.to;
  const paramsBody = body.data;

  return {
    nameOfBucket,
    nameOfTemplate,
    subject,
    source,
    destination,
    paramsBody,
  };
};

const getContent = async (
  nameOfBucket: string,
  nameOfTemplate: string
): Promise<string> => {
  const data = await s3
    .getObject({ Bucket: nameOfBucket, Key: nameOfTemplate })
    .promise();

  return data.Body.toString();
};

const renderTemplate = (content: string, params: Record<string, any>) => {
  return velocityjs.render(content, params);
};

const sentEmail = async (
  source: string,
  destination: string[],
  content: string,
  subject: string
) => {
  const params: AWS.SES.SendEmailRequest = {
    Source: source,
    Destination: {
      ToAddresses: destination,
    },
    Message: {
      Body: {
        Html: {
          Data: content,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  await ses.sendEmail(params).promise();
};

const destino = async (event) => {
  const parametersEmail: ParametersEmail = getParameters(
    JSON.parse(event.Records[0].body)
  );

  const content = await getContent(
    parametersEmail.nameOfBucket,
    parametersEmail.nameOfTemplate
  );
  const contentTemplate = renderTemplate(content, parametersEmail.paramsBody);
  await sentEmail(
    parametersEmail.source,
    parametersEmail.destination,
    contentTemplate,
    parametersEmail.subject
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello ${event.body}, welcome to the exciting Serverless world!`,
      input: event,
    }),
  };
};

export const main = destino;
