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

import * as DiscordClient from "../../../../lib/discord";
import * as DiscordStorage from "../../storage/discord_storage";
import { Action } from "../action";
import { EffectActionKind } from "./EffectActionKind";
import * as UpdateActiveQuestion from "./UpdateActiveQuestion";
import * as CancelActiveQuestion from "./CancelActiveQuestion";
import * as Reply from "./Reply";
import * as UpdateSenderScore from "./UpdateSenderScore";

export type EffectActionHandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

export type EffectAction =
  | UpdateActiveQuestion.UpdateActiveQuestionAction
  | CancelActiveQuestion.CancelActiveQuestionAction
  | Reply.ReplyAction
  | UpdateSenderScore.UpdateSenderScoreAction;

export const processEffectAction = (
  handlerConfig: EffectActionHandlerConfig
) => async (action: Action) => {
  switch (action.kind) {
    case EffectActionKind.UpdateActiveQuestion:
      await UpdateActiveQuestion.handle(handlerConfig)(action);
      break;
    case EffectActionKind.Reply:
      await Reply.handle(handlerConfig)(action);
      break;
    case EffectActionKind.CancelActiveQuestion:
      await CancelActiveQuestion.handle(handlerConfig)(action);
      break;
    case EffectActionKind.CancelActiveQuestion:
      await CancelActiveQuestion.handle(handlerConfig)(action);
      break;
    case EffectActionKind.UpdateSenderScore:
      await UpdateSenderScore.handle(handlerConfig)(action);
      break;
  }
};
