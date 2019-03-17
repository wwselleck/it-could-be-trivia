import * as DiscordMessageHandler from "./discord_message_handler";
import * as DiscordMessageContext from "./discord_message_context";
import { Maybe, None } from "../../lib/types";

const extractCommandName = (prelude: string) => (
  ctx: DiscordMessageContext.MessageContext
): Maybe<string> => {
  let splitContent = ctx.message.content.split(" ");
  if (splitContent.length === 0) {
    return None;
  }
  let firstWord = splitContent[0];
  if (firstWord.startsWith(prelude)) {
    return firstWord.slice(1);
  }
  return None;
};

export const commandHandler = (
  command_prelude: string,
  commands: Array<DiscordMessageHandler.DiscordCommand>
) => (ctx: DiscordMessageContext.MessageContext) => {
  let commandName = extractCommandName(command_prelude)(ctx);
  if (commandName === None) {
    // Message was not a command
    return [];
  }

  // commands could be mapped to an object and closed over to
  // get rid of this O(N) operation. Premature optimization
  // at this point.
  let command = commands.find(c => c.name.includes(commandName as string));
  if (!command) {
    // Message was an invalid command
    return [];
  }
  return command.handler(ctx);
};
