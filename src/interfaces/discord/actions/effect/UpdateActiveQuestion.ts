import { EffectActionKind } from "./EffectActionKind";
import { EffectActionHandlerConfig } from "./effect_action";

export type UpdateActiveQuestionAction = {
  kind: EffectActionKind.UpdateActiveQuestion;
  payload: {
    questionId: string | null;
  };
};

export function create(questionId: string | null): UpdateActiveQuestionAction {
  return {
    kind: EffectActionKind.UpdateActiveQuestion,
    payload: {
      questionId
    }
  };
}

export const handle = ({ message, storage }: EffectActionHandlerConfig) => (
  action: UpdateActiveQuestionAction
) => {
  storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    action.payload.questionId
  );
};
