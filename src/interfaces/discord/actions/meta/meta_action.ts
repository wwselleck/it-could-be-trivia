import { logger } from "../../../../lib/logger";
import { MessageContext } from "../../../message_context";
import { DiscordStorage } from "../../storage/discord_storage";
import * as DiscordClient from "../../../../lib/discord";
import { Action } from "../action";
import { MetaActionKind } from "./MetaActionKind";
import * as AskRandomQuestion from "./AskRandomQuestion";
import * as AnswerQuestion from "./AnswerQuestion";
import * as AnswerSingleAnswerQuestion from "./AnswerSingleAnswerQuestion";
import * as AnswerMultipleAnswerQuestion from "./AnswerMultipleAnswerQuestion";
import * as CancelAndAnswer from "./CancelAndAnswer";
import * as ShowLeaderboard from "./ShowLeaderboard";
import * as ShowUserScore from "./ShowUserScore";

export type MetaActionHandlerConfig = {
  ctx: MessageContext;
  storage: DiscordStorage;
  message: DiscordClient.Message;
};

export type MetaActionHandler = (
  action: MetaAction,
  config: MetaActionHandlerConfig
) => Array<Action>;

export async function processMetaAction(
  action: Action,
  config: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let actions: Promise<Array<Action>>;

  // Maybe clean this up at some point so all meta actions don't
  // have to be manually added here
  switch (action.kind) {
    case MetaActionKind.AskRandomQuestion:
      actions = AskRandomQuestion.handle();
      break;
    case MetaActionKind.AnswerQuestion:
      actions = AnswerQuestion.handle(action, config);
      break;
    case MetaActionKind.AnswerSingleAnswerQuestion:
      actions = AnswerSingleAnswerQuestion.handle(action, config);
      break;
    case MetaActionKind.AnswerMultipleAnswerQuestion:
      actions = AnswerMultipleAnswerQuestion.handle(action, config);
      break;
    case MetaActionKind.CancelAndAnswer:
      actions = CancelAndAnswer.handle(action, config);
      break;
    case MetaActionKind.ShowLeaderboard:
      actions = ShowLeaderboard.handle(action, config);
      break;
    case MetaActionKind.ShowUserScore:
      actions = ShowUserScore.handle(action, config);
      break;
    default:
      return [action];
  }
  let resultingActions = (await Promise.all(
    (await actions).map(action => processMetaAction(action, config))
  )).flat();
  logger.trace({ action, resultingActions }, "processMetaAction Complete");
  return resultingActions;
}

export type MetaAction =
  | AskRandomQuestion.AskRandomQuestionAction
  | AnswerQuestion.AnswerQuestionAction
  | AnswerSingleAnswerQuestion.AnswerSingleAnswerQuestionAction
  | CancelAndAnswer.CancelAndAnswerAction
  | ShowLeaderboard.ShowLeaderboardAction
  | ShowUserScore.ShowUserScoreAction;
