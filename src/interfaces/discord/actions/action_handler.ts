import logger = require("pino");
import * as DiscordClient from "../../../lib/discord";
import * as DiscordStorage from "../storage/discord_storage";
import { Action } from "./action";
import { processMetaAction } from "./meta_action";
import { processEffectAction } from "./effect_action";

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

  handle(message: DiscordClient.Message, actions: Array<Action>) {
    let flattenedActions = actions.map(processMetaAction).flat();
    this.logger.debug(
      {
        actions,
        flattenedActions
      },
      "Flattened Actions"
    );

    let handlerConfig = {
      message,
      client: this.client,
      storage: this.storage
    };
    let effectHandler = processEffectAction(handlerConfig);
    flattenedActions.map(effectHandler);
  }
}
