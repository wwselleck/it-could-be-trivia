import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { Action } from "../action";
import { MetaActionHandlerConfig } from "./meta_action";
import { MetaActionKind } from "./MetaActionKind";
import * as AnswerSingleAnswerQuestion from "./AnswerSingleAnswerQuestion";
import * as AnswerMultipleAnswerQuestion from "./AnswerMultipleAnswerQuestion";

export type AnswerQuestionAction = {
  kind: MetaActionKind.AnswerQuestion;
  payload: {
    question: TriviaQuestions.Question;
  };
};

export async function handle(
  action: AnswerQuestionAction,
  _: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let activeQuestion = action.payload.question;
  if (!activeQuestion) {
    return [];
  }
  switch (activeQuestion.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return [AnswerSingleAnswerQuestion.create(activeQuestion)];
    case TriviaQuestions.QuestionType.MultipleAnswer:
      return [AnswerMultipleAnswerQuestion.create(activeQuestion)];
  }
  return [];
}

export function create(
  question: TriviaQuestions.Question
): AnswerQuestionAction {
  return {
    kind: MetaActionKind.AnswerQuestion,
    payload: {
      question
    }
  };
}
