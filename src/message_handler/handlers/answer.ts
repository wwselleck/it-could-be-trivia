import { MessageContext } from "src/message_context";
import { Action, MetaActionKind } from "src/actions";

export const answerHandler = () => (ctx: MessageContext): Array<Action> => {
  if (!ctx.activeQuestion) {
    return [];
  }
  return [
    {
      kind: MetaActionKind.AnswerQuestion,
      payload: {
        question: ctx.activeQuestion
      }
    }
  ];
};
