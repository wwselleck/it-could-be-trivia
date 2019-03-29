import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MetaActionKind } from "./MetaActionKind";
import { Reply, UpdateActiveQuestion, UpdateSenderScore } from "../effect";
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
      reply = `${answer} is Correct! ${mention} your score is now ${config.ctx
        .message.sender.score + 1}`;
    } else {
      reply = `${
        result.exactAnswer
      }, or ${answer}, is correct! ${mention} your score is now ${config.ctx
        .message.sender.score + 1}`;
    }

    return [
      Reply.create(reply),
      UpdateSenderScore.create(1),
      UpdateActiveQuestion.create(null)
    ];
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
