import * as DiscordClient from "../../lib/discord";
import * as DiscordStorage from "./storage/discord_storage";
import { None } from "../../lib/types";

export type MessageContext = {
  message: {
    content: string;
  };
  activeQuestion?: {
    id: string;
  };
};

type BuildMessageContextConfig = {
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};
export function buildMessageContext({
  message,
  storage
}: BuildMessageContextConfig): MessageContext {
  let server = message.guild;
  let channel = message.channel;

  let activeQuestionId = storage.getActiveQuestion(server.id, channel.id);
  let activeQuestion =
    activeQuestionId === None
      ? {}
      : { activeQuestion: { id: activeQuestionId } };

  return {
    message: {
      content: message.content
    },
    ...activeQuestion
  };
}
