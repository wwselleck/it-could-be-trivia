import { CommandActions } from "../discord_command_message";

function handleDebugActiveQuestion(actions: CommandActions) {
  actions.send(actions.getActiveQuestion() || "No active question");
}

export const createDebugHandler = () => (actions: CommandActions) => {
  let action = actions.getMessageContent().split(" ")[1];
  switch (action) {
    case "activeQuestion":
      handleDebugActiveQuestion(actions);
      break;
  }
};
