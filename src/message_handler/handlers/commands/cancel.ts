import { Action, CancelActiveQuestion, CancelAndAnswer } from "src/actions";
import { MessageContext } from "src/message_context";

export const cancelActiveQuestionHandler = (replyWithAnswer = false) => (
  _: MessageContext
): Array<Action> => {
  if (replyWithAnswer) {
    return [CancelAndAnswer.create()];
  } else {
    return [CancelActiveQuestion.create()];
  }
};
