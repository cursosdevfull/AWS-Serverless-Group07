const testHandler = async (event: any = {}): Promise<any> => {
  console.log("testHandler", event);

  const users = [
    {
      id: 1,
      name: "John",
    },
    {
      id: 2,
      name: "Jane",
    },
    {
      id: 3,
      name: "Max",
    },
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(users),
  };
};

export { testHandler };
