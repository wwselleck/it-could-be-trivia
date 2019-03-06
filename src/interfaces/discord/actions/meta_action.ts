import TriviaQuestions = require("@it-could-be/trivia-questions");

import { EffectActionType } from "./effect_action";
import { Action } from "./action";
import { contentForQuestion } from "./util";

type MetaActionHandler = (action: MetaAction) => Array<Action>;

export enum MetaActionType {
  AskSingleAnswerQuestion = "askSingleAnswerQuestion",
  AskRandomQuestion = "askRandomQuestion"
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

export type AskRandomQuestion = {
  kind: MetaActionType.AskRandomQuestion;
};
function handleAskRandomQuestion(
  action: AskRandomQuestion
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
        content: contentForQuestion(question)
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
    case MetaActionType.AskRandomQuestion:
      actions = handleAskRandomQuestion(action);
      break;
    default:
      return [action];
  }
  return actions.flatMap(processMetaAction);
}

export type MetaAction = AskSingleAnswerQuestion | AskRandomQuestion;
