import * as DiscordClient from "../../../lib/discord";

enum ActionTypes {
  UpdateActiveQuestion,
  Reply = "reply"
}

type HandlerConfig = {
  client: DiscordClient.DiscordClient;
  message: DiscordClient.Message;
};

type UpdateActiveQuestion = {
  kind: "updateActiveQuestion";
  payload: {
    questionId: string;
  };
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

  constructor(client: DiscordClient.DiscordClient) {
    this.client = client;
  }

  handle(message: DiscordClient.Message, actions: Array<Action>) {
    let handlerConfig = {
      message,
      client: this.client
    };
    actions.forEach(action => {
      console.log(action);
      switch (action.kind) {
        case ActionTypes.Reply:
          handleReply(handlerConfig)(action);
          break;
      }
    });
  }
}
