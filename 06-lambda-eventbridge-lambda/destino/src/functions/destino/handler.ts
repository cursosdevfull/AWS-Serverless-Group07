const destino = async (event) => {
  console.log("event", event);
  console.log("Records", event.detail.message);
  return {
    statusCode: 200,
    body: "llegó correctamente",
  };
};

export const main = destino;
