import { Action, MetaActionKind } from "src/actions";
import { MessageContext } from "src/message_context";

export const scoreHandler = (ctx: MessageContext): Array<Action> => {
  return [
    {
      kind: MetaActionKind.ShowUserScore,
      payload: {
        userId: ctx.message.sender.id
      }
    }
  ];
};
