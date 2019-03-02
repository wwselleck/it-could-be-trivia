import logger = require("pino");
import * as Discord from "../../lib/discord";
import { DiscordStorage } from "./storage/discord_storage";
import * as DiscordMessageHandler from "./discord_message_handler";
import * as DiscordActions from "./actions/actions";
import * as DiscordMessageContext from "./discord_message_context";

import { triviaHandler } from "./handlers/commands/trivia";
import { debugHandler } from "./handlers/commands/debug";

let defaultMessageHandler = DiscordMessageHandler.create({
  commandPrelude: "!",
  commands: [
    {
      name: "trivia",
      handler: triviaHandler()
    },
    {
      name: "debug",
      handler: debugHandler()
    }
  ]
});

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
    let handler = DiscordMessageHandler.withLog(logger({ level: "debug" }))(
      defaultMessageHandler
    );
    return (message: Discord.Message) => {
      let context = DiscordMessageContext.buildMessageContext({
        message,
        storage: this.config.storage
      });
      let result = handler(context);
      this.actionHandler.handle(message, result);
    };
  }
}
