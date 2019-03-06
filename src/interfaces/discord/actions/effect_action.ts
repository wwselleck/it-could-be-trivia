/*
 * Actions that actually do things
 *
 */

import * as DiscordClient from "../../../lib/discord";
import * as DiscordStorage from "../storage/discord_storage";
import { Action } from "./action";

type EffectActionHandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

export enum EffectActionType {
  UpdateActiveQuestion = "updateActiveQuestion",
  Reply = "reply",
  CancelActiveQuestion = "cancelActiveQuestion"
}

type UpdateActiveQuestion = {
  kind: EffectActionType.UpdateActiveQuestion;
  payload: {
    questionId: string | null;
  };
};
const handleUpdateActiveQuestion = ({
  message,
  storage
}: EffectActionHandlerConfig) => (action: UpdateActiveQuestion) => {
  storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    action.payload.questionId
  );
};

type CancelActiveQuestion = {
  kind: EffectActionType.CancelActiveQuestion;
};
const handleCancelActiveQuestion = ({
  message,
  storage
}: EffectActionHandlerConfig) => (action: CancelActiveQuestion) => {
  storage.cancelActiveQuestion(message.guild.id, message.channel.id);
};

type Reply = {
  kind: EffectActionType.Reply;
  payload: {
    content: string;
  };
};

const handleReply = ({ message }: EffectActionHandlerConfig) => (
  action: Reply
) => {
  message.channel.send(action.payload.content);
};

export type EffectAction = UpdateActiveQuestion | CancelActiveQuestion | Reply;

export const processEffectAction = (
  handlerConfig: EffectActionHandlerConfig
) => (action: Action) => {
  switch (action.kind) {
    case EffectActionType.Reply:
      handleReply(handlerConfig)(action);
      break;
    case EffectActionType.UpdateActiveQuestion:
      handleUpdateActiveQuestion(handlerConfig)(action);
      break;
  }
};
