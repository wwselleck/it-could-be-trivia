import { Action } from "../index";
import { Reply, CancelActiveQuestion } from "../effect";
import { answerForQuestion } from "../util";
import { MetaActionKind } from "./MetaActionKind";
import { MetaActionHandlerConfig } from "./meta_action";

export type CancelAndAnswerAction = {
  kind: MetaActionKind.CancelAndAnswer;
};

export async function handle(
  _: CancelAndAnswerAction,
  config: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let question = config.ctx.activeQuestion;
  if (!question) {
    return [];
  }
  return [
    CancelActiveQuestion.create(),
    Reply.create(`Cancelled! The answer was ${answerForQuestion(question)}`)
  ];
}

export function create(): CancelAndAnswerAction {
  return {
    kind: MetaActionKind.CancelAndAnswer
  };
}
