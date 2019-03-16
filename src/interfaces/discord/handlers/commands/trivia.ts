import { Reply, AskRandomQuestion } from "../../actions";
import * as DiscordMessageContext from "../../discord_message_context";

export const withQuestionLimit = fn => (
  ctx: DiscordMessageContext.MessageContext
) => {
  if (ctx.activeQuestion && ctx.activeQuestion.id) {
    return [Reply.create("A question is already active")];
  }
  return fn(ctx);
};

export const triviaHandler = withQuestionLimit(
  (_: DiscordMessageContext.MessageContext) => {
    return [AskRandomQuestion.create()];
  }
);
