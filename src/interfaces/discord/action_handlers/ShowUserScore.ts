import { Action, EffectActionKind, ShowUserScore } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";
import { contentForUserScore } from "./util";

export async function handle(
  action: ShowUserScore,
  config: ActionHandlerInfo
): Promise<Array<Action>> {
  let userScore = await config.storage.getUserScore(
    config.message.guild.id,
    action.payload.userId
  );
  return [
    {
      kind: EffectActionKind.Reply,
      payload: {
        content: contentForUserScore(action.payload.userId, userScore)
      }
    }
  ];
}

