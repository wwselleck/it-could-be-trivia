import { Action, MetaActionKind, EffectActionKind } from "src/actions";
import { MessageContext } from "src/message_context";

export const cancelActiveQuestionHandler = (replyWithAnswer = false) => (
  _: MessageContext
): Array<Action> => {
  if (replyWithAnswer) {
    return [
      {
        kind: MetaActionKind.CancelAndAnswer
      }
    ];
  } else {
    return [
      {
        kind: EffectActionKind.CancelActiveQuestion
      }
    ];
  }
};
