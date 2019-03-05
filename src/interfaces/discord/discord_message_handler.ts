import logger = require("pino");
import * as DiscordInterface from "./discord";
import * as DiscordActions from "./actions/actions";
import * as DiscordMessageContext from "./discord_message_context";
import { commandHandler } from "./discord_command_handler";

export type MessageHandler = (
  ctx: DiscordMessageContext.MessageContext
) => Array<DiscordActions.Action>;

export interface DiscordCommand {
  name: string;
  handler: MessageHandler;
  allowedList?: Array<string>;
}

// Figures out where to delegate message handling, and delegates
// Nothing else.
// Nothing.
// Stop typing.
interface DiscordMessageHandlerConfig {
  commandPrelude: string;
  commands?: Array<DiscordCommand>;
}

export const create = (config: DiscordMessageHandlerConfig) => (
  context: DiscordMessageContext.MessageContext
) => {
  let { commandPrelude, commands } = config;

  let handlers = [
    ...(commands ? [commandHandler(commandPrelude, commands)] : [])
  ];
  return handlers.reduce(
    (acc: Array<DiscordActions.Action>, curr: MessageHandler) => {
      return [...acc, ...curr(context)];
    },
    []
  );
};

export const withLog = (logger: logger.Logger) => (fn: MessageHandler) => (
  ctx: DiscordMessageContext.MessageContext
) => {
  let result = fn(ctx);
  logger.debug(
    {
      ctx,
      result
    },
    "Handling message"
  );
  return result;
};
