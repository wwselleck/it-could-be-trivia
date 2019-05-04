import { Action, Reply } from "../../actions";
import { MessageContext } from "../../../message_context";

// Removing the return type annotation here causes TS compiler
// errors. Maybe look into exactly why at some point?
export function activeQuestionHandler(ctx: MessageContext): Array<Action> {
  return [
    Reply.create(
      ctx.activeQuestion ? ctx.activeQuestion.id : "No active question"
    )
  ];
}
