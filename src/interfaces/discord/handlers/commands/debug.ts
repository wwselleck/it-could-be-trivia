import { ActionTypes } from "../../actions/actions";
import * as DiscordInterface from "../../discord";

function handleDebugActiveQuestion(ctx: DiscordInterface.MessageContext) {
  return;
  actions.send(actions.getActiveQuestion() || "No active question");
}

export const createDebugHandler = () => (
  ctx: DiscordInterface.MessageContext
) => {
  let action = ctx.message.content.split(" ")[1];
  switch (action) {
    case "activeQuestion":
      return handleDebugActiveQuestion(actions);
      break;
  }
};
