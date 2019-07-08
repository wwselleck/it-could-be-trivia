import TriviaQuestions = require("@it-could-be/trivia-questions");
import { User } from "src/interfaces/discord/storage/models";

export function mentionForUserId(userId: string) {
  return `<@${userId}>`;
}

function contentForSingleAnswerQuestion(
  question: TriviaQuestions.SingleAnswerQuestion
) {
  return question.detail.text;
}

function contentForMultipleAnswerQuestion(
  question: TriviaQuestions.MultipleAnswerQuestion
) {
  return question.detail.text;
}

export function contentForQuestion(question: TriviaQuestions.Question): string {
  switch (question.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return contentForSingleAnswerQuestion(question);
    case TriviaQuestions.QuestionType.MultipleAnswer:
      return contentForMultipleAnswerQuestion(question);
    default:
      return "Ooopsy";
  }
}

export function answerForQuestion(question: TriviaQuestions.Question): string {
  switch (question.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return TriviaQuestions.Answer.SingleAnswerQuestion.getAnswer(question);
    default:
      return "Gimme a single answer question";
  }
}

export function contentForLeaderboard(users: Array<User>) {
  return users
    .map((u, i) => {
      return `${i + 1}. ${u.name} (${u.score} points)`;
    })
    .join("\n");
}

export function contentForUserScore(userId: string, userScore: number) {
  return `${mentionForUserId(userId)}, your score is ${userScore}.`;
}
