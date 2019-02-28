import * as DiscordClient from "../../../lib/discord";
import * as DiscordStorage from "../storage/discord_storage";

export enum ActionTypes {
  UpdateActiveQuestion = "updateActiveQuestion",
  Reply = "reply"
}

type HandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

type UpdateActiveQuestion = {
  kind: "updateActiveQuestion";
  payload: {
    questionId: string;
  };
};
const handleUpdateActiveQuestion = ({ message, storage }: HandlerConfig) => (
  action: UpdateActiveQuestion
) => {
  console.log(`Handling update active question ${action}`);
  storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    action.payload.questionId
  );
};

type Reply = {
  kind: ActionTypes.Reply;
  payload: {
    content: string;
  };
};

const handleReply = ({ message }: HandlerConfig) => (action: Reply) => {
  console.log(`Handling reply ${action}`);
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
      console.log(action);
      switch (action.kind) {
        case ActionTypes.Reply:
          handleReply(handlerConfig)(action);
          break;
        case ActionTypes.UpdateActiveQuestion:
          handleUpdateActiveQuestion(handlerConfig)(action);
          break;
      }
    });
  }
}
