import { Reply, AskRandomQuestion } from "src/actions";
import { MessageContext } from "src/message_context";

export const withQuestionLimit = (fn: any) => (ctx: MessageContext) => {
  if (ctx.activeQuestion && ctx.activeQuestion.id) {
    return [Reply.create("A question is already active")];
  }
  return fn(ctx);
};

export const triviaHandler = withQuestionLimit((_: MessageContext) => {
  return [AskRandomQuestion.create()];
});
