import * as DiscordClient from "../../../lib/discord";
import * as DiscordStorage from "../storage/discord_storage";

export enum ActionType {
  UpdateActiveQuestion = "updateActiveQuestion",
  Reply = "reply",
  CancelActiveQuestion = "cancelActiveQuestion"
}

type HandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

type UpdateActiveQuestion = {
  kind: ActionType.UpdateActiveQuestion;
  payload: {
    questionId: string | null;
  };
};
const handleUpdateActiveQuestion = ({ message, storage }: HandlerConfig) => (
  action: UpdateActiveQuestion
) => {
  storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    action.payload.questionId
  );
};

type CancelActiveQuestion = {
  kind: ActionType.CancelActiveQuestion;
};
const handleCancelActiveQuestion = ({ message, storage }: HandlerConfig) => (
  action: CancelActiveQuestion
) => {
  storage.cancelActiveQuestion(message.guild.id, message.channel.id);
};

type Reply = {
  kind: ActionType.Reply;
  payload: {
    content: string;
  };
};

const handleReply = ({ message }: HandlerConfig) => (action: Reply) => {
  message.channel.send(action.payload.content);
};

export type Action = UpdateActiveQuestion | Reply;

// Destructive
//
export class DiscordActionHandler {
  private client: DiscordClient.DiscordClient;
  private storage: DiscordStorage.DiscordStorage;

  constructor(
    client: DiscordClient.DiscordClient,
    storage: DiscordStorage.DiscordStorage
  ) {
    this.client = client;
    this.storage = storage;
  }

  handle(message: DiscordClient.Message, actions: Array<Action>) {
    let handlerConfig = {
      message,
      client: this.client,
      storage: this.storage
    };
    actions.forEach(action => {
      switch (action.kind) {
        case ActionType.Reply:
          handleReply(handlerConfig)(action);
          break;
        case ActionType.UpdateActiveQuestion:
          handleUpdateActiveQuestion(handlerConfig)(action);
          break;
      }
    });
  }
}
