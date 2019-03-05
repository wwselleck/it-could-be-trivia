import { ActionType, Action } from "../../actions/actions";
import * as DiscordInterface from "../../discord";
import * as DiscordMessageContext from "../../discord_message_context";
import * as DiscordMessageHandler from "../../discord_message_handler";

// Removing the return type annotation here causes TS compiler
// errors. Maybe look into exactly why at some point?
function handleDebugActiveQuestion(
  ctx: DiscordMessageContext.MessageContext
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

function handleDebugCancelActiveQuestion(
  ctx: DiscordMessageContext.MessageContext
): Array<Action> {
  return [
    {
      kind: ActionType.UpdateActiveQuestion,
      payload: {
        questionId: null
      }
    }
  ];
}

const DebugCommands: Record<string, DiscordMessageHandler.MessageHandler> = {
  activeQuestion: handleDebugActiveQuestion,
  cancelActiveQuestion: handleDebugCancelActiveQuestion
};

export const debugHandler = () => (
  ctx: DiscordMessageContext.MessageContext
) => {
  let action = ctx.message.content.split(" ")[1];
  let handler = DebugCommands[action];
  if (!handler) {
    return [];
  }
  return handler(ctx);
};
