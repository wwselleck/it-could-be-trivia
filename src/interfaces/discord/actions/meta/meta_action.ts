import { logger } from "../../../../lib/logger";
import { MessageContext } from "../../../message_context";
import { Action } from "../action";
import { MetaActionKind } from "./MetaActionKind";
import * as AskRandomQuestion from "./AskRandomQuestion";
import * as AnswerQuestion from "./AnswerQuestion";
import * as AnswerSingleAnswerQuestion from "./AnswerSingleAnswerQuestion";
import * as CancelAndAnswer from "./CancelAndAnswer";

export type MetaActionHandlerConfig = {
  ctx: MessageContext;
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
    case MetaActionKind.CancelAndAnswer:
      actions = CancelAndAnswer.handle(action, config);
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
  | AnswerSingleAnswerQuestion.AnswerSingleAnswerQuestionAction
  | CancelAndAnswer.CancelAndAnswerAction;
