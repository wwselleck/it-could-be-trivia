import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MetaActionKind } from "./MetaActionKind";
import { Reply, UpdateActiveQuestion } from "../effect";
import { MetaActionHandlerConfig } from "./meta_action";
import { Action } from "../action";

export type AnswerQuestionAction = {
  kind: MetaActionKind.AnswerQuestion;
  payload: {
    question: TriviaQuestions.Question;
  };
};

export function handle(
  action: AnswerQuestionAction,
  config: MetaActionHandlerConfig
): Array<Action> {
  let activeQuestion = action.payload.question;
  if (!activeQuestion) {
    return [];
  }
  let answer = config.ctx.message.content.trim();
  if (TriviaQuestions.verifyAnswer(activeQuestion, answer)) {
    return [
      Reply.create(`${answer} is Correct!`),
      UpdateActiveQuestion.create(null)
    ];
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
