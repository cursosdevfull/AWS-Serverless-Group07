import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const sft = new AWS.StepFunctions();

const executeStepFunction = (valueToSent: number) => {
  const stateMachineName = "numberStateMachine";

  return sft
    .listStateMachines({})
    .promise()
    .then((list) => {
      const count = list.stateMachines?.length || 0;

      for (let ind = 0; ind < count; ind++) {
        const stateMachine = list.stateMachines?.[ind];
        if (stateMachine?.name === stateMachineName) {
          const params = {
            stateMachineArn: stateMachine.stateMachineArn || "",
            input: JSON.stringify({ numero: valueToSent }),
            name: uuidv4(),
          };

          return sft.startExecution(params).promise().then();
        }
      }
    });
};

const trigger = async (event) => {
  console.log("event", event);
  const number = event.queryStringParameters?.number || 0;

  try {
    await executeStepFunction(+number);
    return { body: JSON.stringify({ number }) };
  } catch (error) {}
};

export const main = trigger;
