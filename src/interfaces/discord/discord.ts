import * as Discord from "../../lib/discord";
import { createTriviaCommand } from "./commands/trivia";

export interface DiscordInterface {
  _client: Discord.DiscordClient;
}

export interface DiscordInterfaceConfig {
  token: string;
}

export function createDiscordInterface(
  config: DiscordInterfaceConfig
): DiscordInterface {
  let client = Discord.createClient(config.token);
  Discord.registerCommand(client, createTriviaCommand());
  return {
    _client: client
  };
}

export function connect(di: DiscordInterface) {
  Discord.connect(di._client);
}
