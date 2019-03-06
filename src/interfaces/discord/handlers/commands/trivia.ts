import TriviaQuestions = require("@it-could-be/trivia-questions");

import * as DiscordInterface from "../../discord";
import * as DiscordAction from "../../actions/action";
import * as DiscordMessageContext from "../../discord_message_context";

const { QuestionType, getRandomQuestion } = TriviaQuestions;

export const withQuestionLimit = fn => (
  ctx: DiscordMessageContext.MessageContext
) => {
  if (ctx.activeQuestion && ctx.activeQuestion.id) {
    return [
      {
        kind: DiscordAction.ActionType.Reply,
        payload: {
          content: "A question is already active"
        }
      }
    ];
  }
  return fn(ctx);
};

export const triviaHandler = withQuestionLimit(
  (ctx: DiscordMessageContext.MessageContext) => {
    return [
      {
        kind: DiscordAction.ActionType.AskRandomQuestion
      }
    ];
  }
);
