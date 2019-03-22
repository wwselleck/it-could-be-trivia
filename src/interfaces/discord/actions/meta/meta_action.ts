import { logger } from "../../../../lib/logger";
import * as DiscordMessageContext from "../../discord_message_context";
import { Action } from "../action";
import { MetaActionKind } from "./MetaActionKind";
import * as AskRandomQuestion from "./AskRandomQuestion";
import * as AnswerQuestion from "./AnswerQuestion";
import * as AnswerSingleAnswerQuestion from "./AnswerSingleAnswerQuestion";

export type MetaActionHandlerConfig = {
  ctx: DiscordMessageContext.MessageContext;
};

export type MetaActionHandler = (
  action: MetaAction,
  config: MetaActionHandlerConfig
) => Array<Action>;

export function processMetaAction(
  action: Action,
  config: MetaActionHandlerConfig
): Array<Action> {
  let actions: Array<Action> = [];
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
    default:
      return [action];
  }
  let resultingActions = actions.flatMap(action =>
    processMetaAction(action, config)
  );
  logger.trace({ action, resultingActions }, "processMetaAction Complete");
  return resultingActions;
}

export type MetaAction =
  | AskRandomQuestion.AskRandomQuestionAction
  | AnswerQuestion.AnswerQuestionAction
  | AnswerSingleAnswerQuestion.AnswerSingleAnswerQuestionAction;
