import * as DiscordMessageContext from "../discord_message_context";
import * as Action from "../actions";

export const answerHandler = () => (
  ctx: DiscordMessageContext.MessageContext
): Array<Action.Action> => {
  if (!ctx.activeQuestion) {
    return [];
  }
  return [Action.AnswerQuestion.create(ctx.activeQuestion.id)];
};
