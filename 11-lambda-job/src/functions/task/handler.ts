const task = async (event) => {
  console.log("Hello from task!");
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from task!",
    }),
  };
};

export const main = task;
