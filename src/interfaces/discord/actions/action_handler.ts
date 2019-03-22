import logger = require("pino");
import * as DiscordClient from "../../../lib/discord";
import * as DiscordStorage from "../storage/discord_storage";
import * as DiscordMessageContext from "../discord_message_context";
import { Action } from "./action";
import { processMetaAction } from "./meta";
import { processEffectAction } from "./effect";

export class DiscordActionHandler {
  private client: DiscordClient.DiscordClient;
  private storage: DiscordStorage.DiscordStorage;
  private logger: logger.Logger;

  constructor(
    client: DiscordClient.DiscordClient,
    storage: DiscordStorage.DiscordStorage,
    logger: logger.Logger
  ) {
    this.client = client;
    this.storage = storage;
    this.logger = logger;
  }

  async handle(
    ctx: DiscordMessageContext.MessageContext,
    message: DiscordClient.Message,
    actions: Array<Action>
  ) {
    let config = { ctx };
    let flattenedActions = actions
      .map(action => processMetaAction(action, config))
      .flat();
    this.logger.debug(
      {
        ctx,
        actions,
        flattenedActions
      },
      "Actions for Message"
    );

    let handlerConfig = {
      message,
      client: this.client,
      storage: this.storage
    };
    let effectHandler = await processEffectAction(handlerConfig);
    flattenedActions.map(effectHandler);
  }
}
