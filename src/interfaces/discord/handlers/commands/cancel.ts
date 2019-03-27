import {
  Action,
  Reply,
  CancelActiveQuestion,
  CancelAndAnswer
} from "../../actions";
import * as DiscordMessageContext from "../../discord_message_context";

export const cancelActiveQuestionHandler = (replyWithAnswer = false) => (
  _: DiscordMessageContext.MessageContext
): Array<Action> => {
  if (replyWithAnswer) {
    return [CancelAndAnswer.create()];
  } else {
    return [CancelActiveQuestion.create()];
  }
};
