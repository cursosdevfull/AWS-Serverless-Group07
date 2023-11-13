const step02 = async (event) => {
  console.log("event", event);
  return {
    ticketNumber: event.numero,
    patientName: "Sergio",
  };
};

export const main = step02;
