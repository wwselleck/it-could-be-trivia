import logger = require("pino");
import * as Discord from "../../lib/discord";
import { DiscordStorage } from "./storage/discord_storage";
import * as DiscordMessageHandler from "./discord_message_handler";
import * as DiscordActions from "./actions";
import * as DiscordMessageContext from "./discord_message_context";

import { triviaHandler } from "./handlers/commands/trivia";
import { cancelActiveQuestionHandler } from "./handlers/commands/cancel";
import { activeQuestionHandler } from "./handlers/commands/active";

let defaultMessageHandler = DiscordMessageHandler.create({
  commandPrelude: "!",
  commands: [
    {
      name: ["trivia", "t"],
      handler: triviaHandler,
      subcommands: [
        {
          name: ["cancel", "c"],
          handler: cancelActiveQuestionHandler
        },
        {
          name: ["active", "aq"],
          handler: activeQuestionHandler
        }
      ]
    }
  ]
});

export interface DiscordInterfaceConfig {
  token: string;
  storage: DiscordStorage;
  logger: logger.Logger;
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
      config.storage,
      this.config.logger
    );
  }

  async connect() {
    this.client.connect({
      onMessage: [this.createMessageHandler()]
    });
  }

  private createMessageHandler() {
    let handler = DiscordMessageHandler.withLog(this.config.logger)(
      defaultMessageHandler
    );
    return async (message: Discord.Message) => {
      let context = await DiscordMessageContext.buildMessageContext({
        message,
        storage: this.config.storage
      });
      let result = handler(context);
      await this.actionHandler.handle(context, message, result);
    };
  }
}
