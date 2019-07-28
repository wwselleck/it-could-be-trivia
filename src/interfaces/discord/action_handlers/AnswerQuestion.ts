import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { Action, MetaActionKind, AnswerQuestion } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";

export async function handle(
  action: AnswerQuestion,
  _: ActionHandlerInfo
): Promise<Array<Action>> {
  let activeQuestion = action.payload.question;
  if (!activeQuestion) {
    return [];
  }
  switch (activeQuestion.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return [
        {
          kind: MetaActionKind.AnswerSingleAnswerQuestion,
          payload: {
            question: activeQuestion
          }
        }
      ];
  }
  return [];
}
