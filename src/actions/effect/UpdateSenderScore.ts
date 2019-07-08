import { EffectActionKind } from "./EffectActionKind";
import { EffectActionHandlerConfig } from "./effect_action";

export type UpdateSenderScoreAction = {
  kind: EffectActionKind.UpdateSenderScore;
  payload: {
    amount: number;
  };
};

export function create(amount: number): UpdateSenderScoreAction {
  return {
    kind: EffectActionKind.UpdateSenderScore,
    payload: {
      amount
    }
  };
}

export const handle = ({
  message,
  storage
}: EffectActionHandlerConfig) => async (action: UpdateSenderScoreAction) => {
  await storage.updateScore(
    message.guild.id,
    message.author.id,
    action.payload.amount
  );
};
