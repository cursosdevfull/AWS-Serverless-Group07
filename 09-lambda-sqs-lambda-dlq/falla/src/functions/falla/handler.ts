const falla = async (event) => {
  console.log("body", JSON.parse(event.Records[0].body));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "falla",
      },
      null,
      2
    ),
  };
};

export const main = falla;
