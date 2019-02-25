import Discord = require("discord.js");
import { withUserBlocking, onMessageHandler } from "./handler";

export type Message = Discord.Message;
export type MessageHandler = (message: Discord.Message) => any;

export interface ConnectOptions {
  onMessage: Array<MessageHandler>;
}

export class DiscordClient {
  _token: string;
  _client: Discord.Client;

  constructor(token: string) {
    this._token = token;
    this._client = new Discord.Client();
  }

  connect(options: ConnectOptions) {
    options.onMessage.forEach(fn => this._onMessage(fn));
    this._client.login(this._token);
  }

  _onMessage(fn: onMessageHandler) {
    this._client.on("message", fn);
  }
}
