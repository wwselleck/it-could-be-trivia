import { Reply, AskRandomQuestion } from "../../actions";
import { MessageContext } from "../../../message_context";

export const withQuestionLimit = (fn: any) => (ctx: MessageContext) => {
  if (ctx.activeQuestion && ctx.activeQuestion.id) {
    return [Reply.create("A question is already active")];
  }
  return fn(ctx);
};

export const triviaHandler = withQuestionLimit((_: MessageContext) => {
  return [AskRandomQuestion.create()];
});
