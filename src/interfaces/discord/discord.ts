import * as Discord from "../../lib/discord";
import { DiscordStorage } from "./storage/discord_storage";
import * as DiscordMessageHandler from "./discord_message_handler";
import * as DiscordActions from "./actions/actions";
import { triviaHandler } from "./handlers/trivia";

export type MessageContext = {
  message: {
    content: string;
  };
};

function clientMessageToMessageContext(message: Discord.Message) {
  return {
    message: {
      content: message.content
    }
  };
}

const withMessageContext = (fn: (ctx: MessageContext) => void) => (
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
    this.actionHandler = new DiscordActions.DiscordActionHandler();
  }

  connect() {
    let { token } = this.config;
    this.client.connect({
      onMessage: [this.createMessageHandler()]
    });
  }

  private createMessageHandler() {
    let messageHandler = DiscordMessageHandler.create({
      command_prelude: "!",
      commands: [
        {
          name: "trivia",
          handler: triviaHandler()
        }
      ]
    });

    return (message: Discord.Message) => {
      let result = messageHandler(clientMessageToMessageContext(message));
      this.actionHandler.handle(result);
    };
  }
}
