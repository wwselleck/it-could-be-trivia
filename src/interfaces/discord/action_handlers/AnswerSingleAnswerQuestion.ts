import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { MessageContext } from "src/message_context";
import {
  Action,
  EffectActionKind,
  AnswerSingleAnswerQuestion
} from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";
import { mentionForUserId } from "./util";

function getReplyText(
  ctx: MessageContext,
  answer: string,
  answerResult: TriviaQuestions.Answer.SingleAnswerQuestion.AnswerResult
) {
  return [
    answerResult.isExactAnswer
      ? `${answer}, is correct`
      : `${answerResult.exactAnswer}, or ${answer}, is correct!`,
    mentionForUserId(ctx.message.sender.id),
    `your score is now ${ctx.message.sender.score + 1}`
  ].join(" ");
}

export async function handle(
  action: AnswerSingleAnswerQuestion,
  info: ActionHandlerInfo
): Promise<Array<Action>> {
  let answer = info.ctx.message.content.trim();
  let question = action.payload.question;

  let result = TriviaQuestions.Answer.SingleAnswerQuestion.verifyAnswer(
    question,
    answer
  );

  if (result.isCorrect) {
    return [
      {
        kind: EffectActionKind.Reply,
        payload: {
          content: getReplyText(info.ctx, answer, result)
        }
      },
      {
        kind: EffectActionKind.UpdateSenderScore,
        payload: {
          amount: 1
        }
      },
      {
        kind: EffectActionKind.UpdateActiveQuestion,
        payload: {
          questionId: null
        }
      }
    ];
  }
  return [];
}
