const end = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hola desde el destino",
    }),
  };
};

export const main = end;
