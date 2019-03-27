import { Action, Reply, UpdateActiveQuestion } from "../../actions";
import * as DiscordMessageContext from "../../discord_message_context";
import * as DiscordMessageHandler from "../../discord_message_handler";

export function cancelActiveQuestionHandler(
  _: DiscordMessageContext.MessageContext
): Array<Action> {
  return [UpdateActiveQuestion.create(null)];
}
