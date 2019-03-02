import TriviaQuestions = require("@it-could-be/trivia-questions");

import * as DiscordInterface from "../../discord";
import * as DiscordActions from "../../actions/actions";
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

export const triviaHandler = () => (
  ctx: DiscordMessageContext.MessageContext
) => {
  let randomQuestion = getRandomQuestion();
  switch (randomQuestion.question_type_id) {
    case QuestionType.MULTIPLE_ANSWER:
      return handleMultipleAnswerQuestion(randomQuestion)(ctx);
      break;
    case QuestionType.SINGLE_ANSWER:
      return handleSingleAnswerQuestion(randomQuestion)(ctx);
      break;
    case QuestionType.MULTIPLE_CHOICE:
      return handleMultipleChoiceQuestion(randomQuestion)(ctx);
      break;
  }
  return [];
};
