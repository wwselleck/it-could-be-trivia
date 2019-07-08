import * as TriviaQuestions from "@it-could-be/trivia-questions";
import * as DiscordClient from "src/lib/discord";
import { None } from "src/lib/types";
import { logger } from "src/lib/logger";
import { MessageContext } from "src/message_context";
import * as DiscordStorage from "./storage/discord_storage";
const questions = require("@it-could-be/trivia-questions/dist/questions.json");

type BuildMessageContextConfig = {
  message: DiscordClient.Message;
  storage: DiscordStorage.DiscordStorage;
};

export async function buildMessageContext({
  message,
  storage
}: BuildMessageContextConfig): Promise<MessageContext> {
  logger.trace({ message: message.id }, "Creating MessageContext(Discord)");
  let server = message.guild;
  let channel = message.channel;

  let activeQuestionId = await storage.getActiveQuestion(server.id, channel.id);
  let activeQuestion = {
    activeQuestion:
      activeQuestionId === None
        ? null
        : TriviaQuestions.getQuestionById(questions, activeQuestionId)
  };

  let ctx = {
    message: {
      content: message.content,
      sender: {
        id: message.author.id,
        username: message.author.username,
        score: await storage.getUserScore(server.id, message.author.id)
      }
    },
    ...activeQuestion
  };

  logger.trace({ ctx }, "Built context");

  return ctx;
}
