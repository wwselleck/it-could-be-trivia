import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MetaActionKind } from "./MetaActionKind";

export type AnswerQuestion = {
  kind: MetaActionKind.AnswerQuestion;
  payload: {
    question: TriviaQuestions.Question;
  };
};

export type AnswerSingleAnswerQuestion = {
  kind: MetaActionKind.AnswerSingleAnswerQuestion;
  payload: {
    question: TriviaQuestions.SingleAnswerQuestion;
  };
};

export type AskRandomQuestion = {
  kind: MetaActionKind.AskRandomQuestion;
};

export type CancelAndAnswer = {
  kind: MetaActionKind.CancelAndAnswer;
};

export type ShowLeaderboard = {
  kind: MetaActionKind.ShowLeaderboard;
};

export type ShowUserScore = {
  kind: MetaActionKind.ShowUserScore;
  payload: {
    userId: string;
  };
};

export type MetaAction =
  | AskRandomQuestion
  | AnswerQuestion
  | AnswerSingleAnswerQuestion
  | CancelAndAnswer
  | ShowLeaderboard
  | ShowUserScore;
