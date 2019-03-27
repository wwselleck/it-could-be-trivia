import { Action, Reply } from "../../actions";
import * as DiscordMessageContext from "../../discord_message_context";
import * as DiscordMessageHandler from "../../discord_message_handler";

// Removing the return type annotation here causes TS compiler
// errors. Maybe look into exactly why at some point?
export function activeQuestionHandler(
  ctx: DiscordMessageContext.MessageContext
): Array<Action> {
  return [
    Reply.create(
      ctx.activeQuestion ? ctx.activeQuestion.id : "No active question"
    )
  ];
}

