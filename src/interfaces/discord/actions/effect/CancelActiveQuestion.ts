import { EffectActionKind } from "./EffectActionKind";
import { EffectActionHandlerConfig } from "./effect_action";

export type CancelActiveQuestionAction = {
  kind: EffectActionKind.CancelActiveQuestion;
};

export const create = (): CancelActiveQuestionAction => ({
  kind: EffectActionKind.CancelActiveQuestion
});

export const handle = ({ message, storage }: EffectActionHandlerConfig) => (
  _: CancelActiveQuestionAction
) => {
  storage.cancelActiveQuestion(message.guild.id, message.channel.id);
};
