import TriviaQuestions = require("@it-could-be/trivia-questions");

import { EffectActionType } from "./effect_action";
import { Action } from "./action";

type MetaActionHandler = (action: MetaAction) => Array<Action>;

export enum MetaActionType {
  AskSingleAnswerQuestion = "askSingleAnswerQuestion"
}

export type AskSingleAnswerQuestion = {
  kind: MetaActionType.AskSingleAnswerQuestion;
};
function handleAskSingleAnswerQuestion(
  action: AskSingleAnswerQuestion
): Array<Action> {
  let question = TriviaQuestions.getRandomQuestion();
  return [
    {
      kind: EffectActionType.UpdateActiveQuestion,
      payload: {
        questionId: question.id
      }
    },
    {
      kind: EffectActionType.Reply,
      payload: {
        content: question.detail.text
      }
    }
  ];
}

export function processMetaAction(action: Action): Array<Action> {
  let actions: Array<Action> = [];
  switch (action.kind) {
    case MetaActionType.AskSingleAnswerQuestion:
      actions = handleAskSingleAnswerQuestion(action);
      break;
    default:
      return [action];
  }
  return actions.flatMap(processMetaAction);
}

export type MetaAction = AskSingleAnswerQuestion;
