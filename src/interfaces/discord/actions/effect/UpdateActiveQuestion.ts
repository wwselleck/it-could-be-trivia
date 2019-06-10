import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { EffectActionKind } from "./EffectActionKind";
import { EffectActionHandlerConfig } from "./effect_action";

export type UpdateActiveQuestionAction = {
  kind: EffectActionKind.UpdateActiveQuestion;
  payload: {
    question: TriviaQuestions.Question | null;
  };
};

export function create(
  question: TriviaQuestions.Question | null
): UpdateActiveQuestionAction {
  return {
    kind: EffectActionKind.UpdateActiveQuestion,
    payload: {
      question
    }
  };
}

export const handle = ({
  message,
  storage
}: EffectActionHandlerConfig) => async (action: UpdateActiveQuestionAction) => {
  const {
    payload: { question }
  } = action;
  await storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    question
  );
};
