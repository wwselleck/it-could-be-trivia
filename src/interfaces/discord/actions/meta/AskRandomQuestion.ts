import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { Action } from "../index";
import { Reply, UpdateActiveQuestion } from "../effect";
import { contentForQuestion } from "../util";
import { MetaActionKind } from "./MetaActionKind";

export type AskRandomQuestionAction = {
  kind: MetaActionKind.AskRandomQuestion;
};

export function handle(): Array<Action> {
  let question = TriviaQuestions.getRandomQuestion();
  return [
    UpdateActiveQuestion.create(question.id),
    Reply.create(contentForQuestion(question))
  ];
}

export function create(): AskRandomQuestionAction {
  return {
    kind: MetaActionKind.AskRandomQuestion
  };
}
