const hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(event.body),
  };
};

export const main = hello;
