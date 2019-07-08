import { EffectActionKind } from "./EffectActionKind";
import { EffectActionHandlerConfig } from "./effect_action";

export type ReplyAction = {
  kind: EffectActionKind.Reply;
  payload: {
    content: string;
  };
};

export const handle = ({ message }: EffectActionHandlerConfig) => (
  action: ReplyAction
) => {
  message.channel.send(action.payload.content);
};

export const create = (content: string): ReplyAction => {
  return {
    kind: EffectActionKind.Reply,
    payload: { content }
  };
};
