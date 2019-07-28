import logger = require("pino");
import { Action } from "src/actions";
import { MessageContext } from "src/message_context";
import { commandHandler } from "./command_handler";
import { answerHandler } from "./handlers/answer";

export type MessageHandler = (ctx: MessageContext) => Array<Action>;

export interface Command {
  name: Array<string>;
  handler: MessageHandler;
  subcommands?: Array<Command>;
  allowedList?: Array<string>;
}

// Figures out where to delegate message handling, and delegates
// Nothing else.
// Nothing.
// Stop typing.
interface DiscordMessageHandlerConfig {
  commandPrelude: string;
  commands?: Array<Command>;
}

export const create = (config: DiscordMessageHandlerConfig) => (
  context: MessageContext
) => {
  let { commandPrelude, commands } = config;

  let handlers = [
    ...(commands ? [commandHandler(commandPrelude, commands)] : []),
    answerHandler()
  ];
  return handlers.reduce((acc: Array<Action>, curr: MessageHandler) => {
    return [...acc, ...curr(context)];
  }, []);
};

export const withLog = (logger: logger.Logger) => (fn: MessageHandler) => (
  ctx: MessageContext
) => {
  logger.debug({ ctx }, "Handling message");
  let result = fn(ctx);
  logger.debug(
    {
      ctx,
      result
    },
    "Handled message"
  );
  return result;
};
