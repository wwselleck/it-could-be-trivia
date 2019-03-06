import TriviaQuestions = require("@it-could-be/trivia-questions");

import * as DiscordInterface from "../../discord";
import * as DiscordAction from "../../actions/action";
import * as DiscordMessageContext from "../../discord_message_context";

const { QuestionType, getRandomQuestion } = TriviaQuestions;

const withUpdateActiveQuestion = fn => (question: TriviaQuestions.Question) => (
  ctx: DiscordMessageContext.MessageContext
) => {
  return [
    {
      kind: "updateActiveQuestion",
      payload: {
        questionId: question.id
      }
    },
    ...fn(question)(ctx)
  ];
};

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

const handleMultipleAnswerQuestion = withUpdateActiveQuestion(
  (question: TriviaQuestions.MultipleAnswerQuestion) => (
    ctx: DiscordMessageContext.MessageContext
  ) => {
    return [
      {
        kind: "reply",
        payload: {
          content: question.detail.text
        }
      }
    ];
  }
);

const handleSingleAnswerQuestion = withUpdateActiveQuestion(
  (question: TriviaQuestions.SingleAnswerQuestion) => (
    ctx: DiscordMessageContext.MessageContext
  ) => {
    return [
      {
        kind: "reply",
        payload: {
          content: question.detail.text
        }
      }
    ];
  }
);

const handleMultipleChoiceQuestion = withUpdateActiveQuestion(
  (question: TriviaQuestions.MultipleChoiceQuestion) => (
    ctx: DiscordMessageContext.MessageContext
  ) => {
    return [
      {
        kind: "reply",
        payload: {
          content: `${question.detail.text}: ${question.detail.choices}`
        }
      }
    ];
  }
);

export const triviaHandler = withQuestionLimit(
  (ctx: DiscordMessageContext.MessageContext) => {
    return [
      {
        kind: DiscordAction.ActionType.AskSingleAnswerQuestion
      }
    ];
  }
);
