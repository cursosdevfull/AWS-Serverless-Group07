const appointmentMX = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};

export const main = appointmentMX;
