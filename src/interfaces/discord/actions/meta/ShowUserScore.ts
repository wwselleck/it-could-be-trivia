import { Action, Reply } from "../index";
import { MetaActionKind } from "./MetaActionKind";
import { MetaActionHandlerConfig } from "./meta_action";
import { contentForUserScore } from "../util";

export type ShowUserScoreAction = {
  kind: MetaActionKind.ShowUserScore;
  userId: string;
};

export async function handle(
  action: ShowUserScoreAction,
  config: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let userScore = await config.storage.getUserScore(
    config.message.guild.id,
    action.userId
  );
  return [Reply.create(contentForUserScore(action.userId, userScore))];
}

export function create(userId: string): ShowUserScoreAction {
  return {
    kind: MetaActionKind.ShowUserScore,
    userId
  };
}
