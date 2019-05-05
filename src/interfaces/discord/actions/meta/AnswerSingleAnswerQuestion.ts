import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MessageContext } from "../../../message_context";
import { MetaActionKind } from "./MetaActionKind";
import { Reply, UpdateActiveQuestion, UpdateSenderScore } from "../effect";
import { MetaActionHandlerConfig } from "./meta_action";
import { Action } from "../action";

export type AnswerSingleAnswerQuestionAction = {
  kind: MetaActionKind.AnswerSingleAnswerQuestion;
  payload: {
    question: TriviaQuestions.SingleAnswerQuestion;
  };
};

function getReplyText(
  ctx: MessageContext,
  answer: string,
  answerResult: TriviaQuestions.Answer.SingleAnswerQuestion.AnswerResult
) {
  return [
    answerResult.isExactAnswer
      ? `${answer}, is correct`
      : `${answerResult.exactAnswer}, or ${answer}, is correct!`,
    `<@${ctx.message.sender.id}>`,
    `your score is now ${ctx.message.sender.score + 1}`
  ].join(" ");
}

export function handle(
  action: AnswerSingleAnswerQuestionAction,
  config: MetaActionHandlerConfig
): Array<Action> {
  let answer = config.ctx.message.content.trim();
  let question = action.payload.question;

  let result = TriviaQuestions.Answer.SingleAnswerQuestion.verifyAnswer(
    question,
    answer
  );

  if (result.isCorrect) {
    return [
      Reply.create(getReplyText(config.ctx, answer, result)),
      UpdateSenderScore.create(1),
      UpdateActiveQuestion.create(null)
    ];
  }
  return [];
}

export function create(
  question: TriviaQuestions.SingleAnswerQuestion
): AnswerSingleAnswerQuestionAction {
  return {
    kind: MetaActionKind.AnswerSingleAnswerQuestion,
    payload: {
      question
    }
  };
}
