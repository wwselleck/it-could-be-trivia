import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MessageContext } from "../../../message_context";
import { MetaActionKind } from "./MetaActionKind";
import { Reply, UpdateActiveQuestion, UpdateSenderScore } from "../effect";
import { MetaActionHandlerConfig } from "./meta_action";
import { Action } from "../action";
import { mentionForUserId } from "../util";

export type AnswerMultipleAnswerQuestionAction = {
  kind: MetaActionKind.AnswerMultipleAnswerQuestion;
  payload: {
    question: TriviaQuestions.MultipleAnswerQuestion;
  };
};

function getReplyText(
  ctx: MessageContext,
  answer: string,
  answerResult: TriviaQuestions.Answer.MultipleAnswerQuestion.AnswerResult
) {
  return [
    answerResult.isExactAnswer
      ? `${answer}, is correct`
      : `${answerResult.exactAnswer}, or ${answer}, is correct!`,
    mentionForUserId(ctx.message.sender.id)
  ].join(" ");
}

export async function handle(
  action: AnswerMultipleAnswerQuestionAction,
  config: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let answer = config.ctx.message.content.trim();
  let question = action.payload.question;

  let result = TriviaQuestions.Answer.MultipleAnswerQuestion.verifyAnswer(
    question,
    answer
  );

  if (result.isCorrect) {
    return [
      Reply.create(getReplyText(config.ctx, answer, result)),
      UpdateSenderScore.create(1)
    ];
  }
  return [];
}

export function create(
  question: TriviaQuestions.MultipleAnswerQuestion
): AnswerMultipleAnswerQuestionAction {
  return {
    kind: MetaActionKind.AnswerMultipleAnswerQuestion,
    payload: {
      question
    }
  };
}
