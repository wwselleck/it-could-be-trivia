import { Action, MetaActionKind, EffectActionKind } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";
import { handle as askRandomQuestionHandler } from "./AskRandomQuestion";
import { handle as answerQuestionHandler } from "./AnswerQuestion";
import { handle as answerSingleAnswerQuestionHandler } from "./AnswerSingleAnswerQuestion";
import { handle as cancelActiveQuestionHandler } from "./CancelActiveQuestion";
import { handle as cancelAndAnswerHandler } from "./CancelAndAnswer";
import { handle as showLeaderboardHandler } from "./ShowLeaderboard";
import { handle as showUserScoreHandler } from "./ShowUserScore";
import { handle as replyHandler } from "./Reply";
import { handle as updateActiveQuestionHandler } from "./UpdateActiveQuestion";
import { handle as updateSenderScoreHandler } from "./UpdateSenderScore";

export async function processMetaAction(
  action: Action,
  info: ActionHandlerInfo
): Promise<Array<Action>> {
  let actions: Promise<Array<Action>>;

  // Maybe clean this up at some point so all meta actions don't
  // have to be manually added here
  switch (action.kind) {
    case MetaActionKind.AskRandomQuestion:
      actions = askRandomQuestionHandler();
      break;
    case MetaActionKind.AnswerQuestion:
      actions = answerQuestionHandler(action, info);
      break;
    case MetaActionKind.AnswerSingleAnswerQuestion:
      actions = answerSingleAnswerQuestionHandler(action, info);
      break;
    case MetaActionKind.CancelAndAnswer:
      actions = cancelAndAnswerHandler(action, info);
      break;
    case MetaActionKind.ShowLeaderboard:
      actions = showLeaderboardHandler(action, info);
      break;
    case MetaActionKind.ShowUserScore:
      actions = showUserScoreHandler(action, info);
      break;
    default:
      return [action];
  }

  let resultingActions = (await Promise.all(
    (await actions).map(action => processMetaAction(action, info))
  )).flat();
  return resultingActions;
}

export const processEffectAction = (info: ActionHandlerInfo) => async (
  action: Action
) => {
  switch (action.kind) {
    case EffectActionKind.UpdateActiveQuestion:
      await updateActiveQuestionHandler(info)(action);
      break;
    case EffectActionKind.Reply:
      await replyHandler(info)(action);
      break;
    case EffectActionKind.CancelActiveQuestion:
      await cancelActiveQuestionHandler(info)(action);
      break;
    case EffectActionKind.UpdateSenderScore:
      await updateSenderScoreHandler(info)(action);
      break;
  }
};
