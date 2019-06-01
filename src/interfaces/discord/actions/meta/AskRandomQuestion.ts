import * as TriviaQuestions from "@it-could-be/trivia-questions";
const questions = require("@it-could-be/trivia-questions/dist/questions.json");
import { Action } from "../index";
import { Reply, UpdateActiveQuestion } from "../effect";
import { contentForQuestion } from "../util";
import { MetaActionKind } from "./MetaActionKind";

export type AskRandomQuestionAction = {
  kind: MetaActionKind.AskRandomQuestion;
};

export async function handle(): Promise<Array<Action>> {
  console.log(questions);
  let question = TriviaQuestions.getRandomQuestion(questions, {
    types: [TriviaQuestions.QuestionType.MultipleAnswer]
  });
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
