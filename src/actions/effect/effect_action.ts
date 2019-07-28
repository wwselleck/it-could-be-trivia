/*
 * Actions that actually do things
 *
 * Effect actions should still be interface-agnostic, although the
 * handlers won't be. They should derive interface-specific
 * things from the environment.
 *
 * Example: UpdateSenderScore
 * amount -> In the action, the amount the score changes
 * can't be derived from the environment.
 * userId -> Not in the action, the handler can derive the senderId
 * from the interface environment. The userId is also environment-specific
 * (all chat user's should theoretically be identifiable by an ID, but
 * that shouldn't be coupled to the action definition)
 *
 */

import { EffectActionKind } from "./EffectActionKind";

export type UpdateActiveQuestion = {
  kind: EffectActionKind.UpdateActiveQuestion;
  payload: {
    questionId: string | null;
  };
};

export type CancelActiveQuestion = {
  kind: EffectActionKind.CancelActiveQuestion;
};

export type Reply = {
  kind: EffectActionKind.Reply;
  payload: {
    content: string;
  };
};

export type UpdateSenderScore = {
  kind: EffectActionKind.UpdateSenderScore;
  payload: {
    amount: number;
  };
};

export type EffectAction =
  | UpdateActiveQuestion
  | CancelActiveQuestion
  | Reply
  | UpdateSenderScore;

