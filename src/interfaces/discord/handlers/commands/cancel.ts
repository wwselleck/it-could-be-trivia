import { Action, CancelActiveQuestion, CancelAndAnswer } from "../../actions";
import { MessageContext } from "../../../message_context";

export const cancelActiveQuestionHandler = (replyWithAnswer = false) => (
  _: MessageContext
): Array<Action> => {
  if (replyWithAnswer) {
    return [CancelAndAnswer.create()];
  } else {
    return [CancelActiveQuestion.create()];
  }
};
