const destino = async (event) => {
  const body = event.Records[0].body;
  console.log("body", body);

  throw new Error("An error happened");
  console.log(body);
  return {
    statusCode: 200,
    body: JSON.stringify(body, null, 2),
  };
};

export const main = destino;
