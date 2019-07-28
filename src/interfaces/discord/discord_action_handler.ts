import logger = require("pino");
import * as DiscordClient from "src/lib/discord";
import { MessageContext } from "src/message_context";
import * as DiscordStorage from "./storage/discord_storage";
import { Action } from "src/actions";
import { processMetaAction, processEffectAction } from "./action_handlers";

export type ActionHandlerInfo = {
  ctx: MessageContext;
  message: DiscordClient.Message;
  client: DiscordClient.DiscordClient;
  storage: DiscordStorage.DiscordStorage;
};

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
    let actionHandlerInfo = {
      ctx,
      message,
      client: this.client,
      storage: this.storage
    };

    let flattenedActions = (await Promise.all(
      actions.map(action => processMetaAction(action, actionHandlerInfo))
    )).flat();
    this.logger.debug(
      {
        ctx,
        actions,
        flattenedActions
      },
      "Actions for Message"
    );

    let effectHandler = await processEffectAction(actionHandlerInfo);
    flattenedActions.map(effectHandler);
  }
}
