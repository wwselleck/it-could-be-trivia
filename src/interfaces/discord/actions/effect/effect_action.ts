/*
 * Actions that actually do things
 *
 */

import * as DiscordClient from "../../../../lib/discord";
import * as DiscordStorage from "../../storage/discord_storage";
import { Action } from "../action";
import { EffectActionKind } from "./EffectActionKind";
import * as UpdateActiveQuestion from "./UpdateActiveQuestion";
import * as CancelActiveQuestion from "./CancelActiveQuestion";
import * as Reply from "./Reply";

export type EffectActionHandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

export type EffectAction =
  | UpdateActiveQuestion.UpdateActiveQuestionAction
  | CancelActiveQuestion.CancelActiveQuestionAction
  | Reply.ReplyAction;

export const processEffectAction = (
  handlerConfig: EffectActionHandlerConfig
) => (action: Action) => {
  switch (action.kind) {
    case EffectActionKind.UpdateActiveQuestion:
      UpdateActiveQuestion.handle(handlerConfig)(action);
      break;
    case EffectActionKind.Reply:
      Reply.handle(handlerConfig)(action);
      break;
    case EffectActionKind.CancelActiveQuestion:
      CancelActiveQuestion.handle(handlerConfig)(action);
      break;
  }
};
