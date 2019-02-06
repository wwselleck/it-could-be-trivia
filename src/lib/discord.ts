import Discord = require("discord.js");

export type Message = Discord.Message;

export interface DiscordClient {
  _token: string;
  _client: Discord.Client;
  _commands: Array<DiscordCommand>;
}

export interface DiscordCommand {
  prelude: string;
  name: string;
  handler(message: Message): void;
}

export function createClient(token: string): DiscordClient {
  return {
    _token: token,
    _client: new Discord.Client(),
    _commands: []
  };
}

export function createCommand(
  name: string,
  handler: DiscordCommand["handler"],
  prelude = "!"
): DiscordCommand {
  return {
    name,
    handler,
    prelude
  };
}

export function registerCommand(
  client: DiscordClient,
  command: DiscordCommand
): DiscordClient {
  client._commands = [...client._commands, command];
  return client;
}

export function connect(client: DiscordClient): DiscordClient {
  client._commands.forEach(command => {
    _listenToCommand(client, command);
  });
  client._client.login(client._token);
  return client;
}

export function _listenToCommand(
  client: DiscordClient,
  command: DiscordCommand
) {
  client._client.on("message", (message: Discord.Message) => {
    command.handler(message);
  });
}
