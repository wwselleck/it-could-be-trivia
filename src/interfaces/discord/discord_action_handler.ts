import logger = require("pino");
import * as DiscordClient from "src/lib/discord";
import * as DiscordStorage from "./storage/discord_storage";
import { MessageContext } from "src/message_context";
import { Action, processMetaAction, processEffectAction } from "src/actions";

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
    ctx: MessageContext,
    message: DiscordClient.Message,
    actions: Array<Action>
  ) {
    let config = { ctx, storage: this.storage, message };
    let flattenedActions = (await Promise.all(
      actions.map(action => processMetaAction(action, config))
    )).flat();
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
