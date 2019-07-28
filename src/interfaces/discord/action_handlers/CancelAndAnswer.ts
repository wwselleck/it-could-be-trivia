import { Action, CancelAndAnswer, EffectActionKind } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";
import { answerForQuestion } from "./util";

export async function handle(
  _: CancelAndAnswer,
  config: ActionHandlerInfo
): Promise<Array<Action>> {
  let question = config.ctx.activeQuestion;
  if (!question) {
    return [];
  }
  return [
    {
      kind: EffectActionKind.CancelActiveQuestion
    },
    {
      kind: EffectActionKind.Reply,
      payload: {
        content: `Cancelled! The a;nswer was ${answerForQuestion(question)}`
      }
    }
  ];
}
