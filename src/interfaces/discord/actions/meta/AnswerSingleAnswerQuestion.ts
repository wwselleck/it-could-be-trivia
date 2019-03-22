import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MetaActionKind } from "./MetaActionKind";
import { Reply, UpdateActiveQuestion } from "../effect";
import { MetaActionHandlerConfig } from "./meta_action";
import { Action } from "../action";

export type AnswerSingleAnswerQuestionAction = {
  kind: MetaActionKind.AnswerSingleAnswerQuestion;
  payload: {
    question: TriviaQuestions.SingleAnswerQuestion.SingleAnswerQuestion;
  };
};

export function handle(
  action: AnswerSingleAnswerQuestionAction,
  config: MetaActionHandlerConfig
): Array<Action> {
  let answer = config.ctx.message.content.trim();
  let question = action.payload.question;

  let result = TriviaQuestions.SingleAnswerQuestion.verifyAnswer(
    question,
    answer
  );

  if (result.isCorrect) {
    let reply: string;
    let mention = `<@${config.ctx.message.sender.id}>`;
    if (result.isExactAnswer) {
      reply = `${answer} is Correct! ${mention}`;
    } else {
      reply = `${result.exactAnswer}, or ${answer}, is correct! ${mention}`;
    }

    return [Reply.create(reply), UpdateActiveQuestion.create(null)];
  }
  return [];
}

export function create(
  question: TriviaQuestions.SingleAnswerQuestion.SingleAnswerQuestion
): AnswerSingleAnswerQuestionAction {
  return {
    kind: MetaActionKind.AnswerSingleAnswerQuestion,
    payload: {
      question
    }
  };
}
