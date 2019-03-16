import { Action, Reply, UpdateActiveQuestion } from "../../actions";
import * as DiscordMessageContext from "../../discord_message_context";
import * as DiscordMessageHandler from "../../discord_message_handler";

// Removing the return type annotation here causes TS compiler
// errors. Maybe look into exactly why at some point?
function handleDebugActiveQuestion(
  ctx: DiscordMessageContext.MessageContext
): Array<Action> {
  return [
    Reply.create(
      ctx.activeQuestion ? ctx.activeQuestion.id : "No active question"
    )
  ];
}

function handleDebugCancelActiveQuestion(
  _: DiscordMessageContext.MessageContext
): Array<Action> {
  return [UpdateActiveQuestion.create(null)];
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
