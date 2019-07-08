import { ShowUserScore } from "src/actions";
import { MessageContext } from "src/message_context";

export const scoreHandler = (ctx: MessageContext) => {
  return [ShowUserScore.create(ctx.message.sender.id)];
};
