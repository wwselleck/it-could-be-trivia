import { ActionType, Action } from "../../actions/actions";
import * as DiscordInterface from "../../discord";

// Removing the return type annotation here causes TS compiler
// errors. Maybe look into exactly why at some point?
function handleDebugActiveQuestion(
  ctx: DiscordInterface.MessageContext
): Array<Action> {
  return [
    {
      kind: ActionType.Reply,
      payload: {
        content: ctx.activeQuestion
          ? ctx.activeQuestion.id
          : "No active question"
      }
    }
  ];
}

export const debugHandler = () => (ctx: DiscordInterface.MessageContext) => {
  let action = ctx.message.content.split(" ")[1];
  switch (action) {
    case "activeQuestion":
      return handleDebugActiveQuestion(ctx);
      break;
  }
  return [];
};
