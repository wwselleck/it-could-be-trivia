import * as DiscordInterface from "./discord";
import * as DiscordActions from "./actions/actions";

type MessageHandler = (
  ctx: DiscordInterface.MessageContext
) => Array<DiscordActions.Action>;

// Figures out where to delegate message handling, and delegates
// Nothing else.
// Nothing.
// Stop typing.
interface DiscordMessageHandlerConfig {
  command_prelude: string;
  commands?: Array<{
    name: string;
    handler: MessageHandler;
    allowedList?: Array<string>;
  }>;
}

export const create = (config: DiscordMessageHandlerConfig) => (
  context: DiscordInterface.MessageContext
) => {
  return config.commands![0]!.handler(context);
};
