const origen = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "origen",
      input: event,
    }),
  };
};

export const main = origen;
