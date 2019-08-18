import logger = require("pino");
import * as Discord from "src/lib/discord";
import * as MessageHandler from "src/message_handler";
import * as DiscordMessageContext from "./message_context";
import { DiscordActionHandler } from "./discord_action_handler";
import { DiscordStorage } from "./storage/discord_storage";

let defaultMessageHandler = MessageHandler.create({
  commandPrelude: "!",
  commands: [
    {
      name: ["trivia", "t"],
      handler: MessageHandler.triviaHandler,
      subcommands: [
        {
          name: ["cancel", "c"],
          handler: MessageHandler.cancelActiveQuestionHandler(false)
        },
        {
          name: ["answer", "a"],
          handler: MessageHandler.cancelActiveQuestionHandler(true)
        },
        {
          name: ["active", "aq"],
          handler: MessageHandler.activeQuestionHandler
        },
        {
          name: ["leaderboard", "lb"],
          handler: MessageHandler.leaderboardHandler
        },
        {
          name: ["score", "s"],
          handler: MessageHandler.scoreHandler
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
  private actionHandler: DiscordActionHandler;

  constructor(config: DiscordInterfaceConfig) {
    this.config = config;
    this.client = new Discord.DiscordClient(this.config.token);
    this.actionHandler = new DiscordActionHandler(
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
    let handler = MessageHandler.withLog(this.config.logger)(
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
