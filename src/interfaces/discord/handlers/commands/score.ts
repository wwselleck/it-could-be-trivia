import { ShowUserScore } from "../../actions";
import { MessageContext } from "../../../message_context";

export const scoreHandler = (ctx: MessageContext) => {
  return [ShowUserScore.create(ctx.message.sender.id)];
};
