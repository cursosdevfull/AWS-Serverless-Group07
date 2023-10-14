const destino = async (event) => {
  const body = event.Records[0].body;
  console.log("destino", body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: body.message,
      event,
    }),
  };
};

export const main = destino;
