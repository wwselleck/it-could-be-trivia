import * as TriviaQuestions from "@it-could-be/trivia-questions";
const questions = require("@it-could-be/trivia-questions/dist/questions.json");
import { Action, EffectActionKind } from "src/actions";
import { contentForQuestion } from "./util";

export async function handle(): Promise<Array<Action>> {
  let question = TriviaQuestions.getRandomQuestion(questions, {
    types: [TriviaQuestions.QuestionType.SingleAnswer]
  });
  return [
    {
      kind: EffectActionKind.UpdateActiveQuestion,
      payload: {
        questionId: question.id
      }
    },
    {
      kind: EffectActionKind.Reply,
      payload: {
        content: contentForQuestion(question)
      }
    }
  ];
}
