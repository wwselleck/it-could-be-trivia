import { MessageContext } from "src/message_context";
import * as Action from "src/actions";

export const answerHandler = () => (
  ctx: MessageContext
): Array<Action.Action> => {
  if (!ctx.activeQuestion) {
    return [];
  }
  return [Action.AnswerQuestion.create(ctx.activeQuestion)];
};
