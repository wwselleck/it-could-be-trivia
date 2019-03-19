import * as TriviaQuestions from "@it-could-be/trivia-questions";
import * as DiscordClient from "../../lib/discord";
import * as DiscordStorage from "./storage/discord_storage";
import { None } from "../../lib/types";

export type MessageContext = {
  message: {
    content: string;
  };
  activeQuestion: TriviaQuestions.Question | null;
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
  let activeQuestion = {
    activeQuestion:
      activeQuestionId === None
        ? null
        : TriviaQuestions.getQuestionById(activeQuestionId)
  };

  return {
    message: {
      content: message.content
    },
    ...activeQuestion
  };
}
