import * as AWS from "aws-sdk";

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const receive = async (event) => {
  const recordS3 = event.Records[0].s3;

  const nameOfBucket = recordS3.bucket.name;
  const key = recordS3.object.key;

  console.log("Bucket name: ", nameOfBucket);
  console.log("Key: ", key);

  const data = await s3.getObject({ Bucket: nameOfBucket, Key: key }).promise();
  const content = data.Body.toString("utf-8");

  const lines = content.split("\n");
  for (const line of lines) {
    const [id, name, specialtyId] = line.split(",");

    const params = {
      TableName: "MedicTable",
      Item: {
        id,
        name,
        specialtyId,
        date: new Date().toISOString(),
      },
    };

    await dynamodb.put(params).promise();
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from receive!",
    }),
  };
};

export const main = receive;
