import * as Discord from "../../lib/discord";
import { DiscordStorage } from "./storage/discord_storage";
import * as DiscordMessageHandler from "./discord_message_handler";
import * as DiscordActions from "./actions/actions";
import { triviaHandler } from "./handlers/commands/trivia";

let defaultMessageHandler = DiscordMessageHandler.create({
  commandPrelude: "!",
  commands: [
    {
      name: "trivia",
      handler: triviaHandler()
    }
  ]
});

export type MessageContext = {
  message: {
    content: string;
  };
  activeQuestion?: {
    id: string;
  };
};

function clientMessageToMessageContext(message: Discord.Message) {
  return {
    message: {
      content: message.content
    }
  };
}

const withMessageContext = (fn: DiscordMessageHandler.MessageHandler) => (
  message: Discord.Message
) => fn(clientMessageToMessageContext(message));

export interface DiscordInterfaceConfig {
  token: string;
  storage: DiscordStorage;
}

export class DiscordInterface {
  private config: DiscordInterfaceConfig;
  private client: Discord.DiscordClient;
  private actionHandler: DiscordActions.DiscordActionHandler;

  constructor(config: DiscordInterfaceConfig) {
    this.config = config;
    this.client = new Discord.DiscordClient(this.config.token);
    this.actionHandler = new DiscordActions.DiscordActionHandler(
      this.client,
      config.storage
    );
  }

  connect() {
    let { token } = this.config;
    this.client.connect({
      onMessage: [this.createMessageHandler()]
    });
  }

  private createMessageHandler() {
    let handler = withMessageContext(defaultMessageHandler);
    return (message: Discord.Message) => {
      let result = handler(message);
      this.actionHandler.handle(message, result);
    };
  }
}
