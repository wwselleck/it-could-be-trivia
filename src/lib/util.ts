import { Message } from "./discord";

export type onMessageHandler = (message: Message) => void;

function blockedCommandHandler(message: Message) {
  message.channel.send("Nice try");
}

export const withUserBlocking = (userWhitelist: Array<string>) => (
  fn: onMessageHandler
) => (message: Message) => {
  let userId = message.author.id;
  if (userWhitelist && !(userId in userWhitelist)) {
    return blockedCommandHandler(message);
  }
  fn(message);
};
