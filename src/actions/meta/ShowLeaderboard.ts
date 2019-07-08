import { Action, Reply } from "../index";
import { MetaActionKind } from "./MetaActionKind";
import { MetaActionHandlerConfig } from "./meta_action";
import { contentForLeaderboard } from "../util";

export type ShowLeaderboardAction = {
  kind: MetaActionKind.ShowLeaderboard;
};

export async function handle(
  _: ShowLeaderboardAction,
  config: MetaActionHandlerConfig
): Promise<Array<Action>> {
  let topUsers = (await config.storage.getTopScores(
    config.message.guild.id
  )).slice(0, 10);
  let topUsersWithNames = await Promise.all(
    topUsers.map(async user => {
      let u = await config.message.guild.fetchMember(user.userId);
      return { ...user, name: u.user.tag };
    })
  );
  return [Reply.create(contentForLeaderboard(topUsersWithNames))];
}

export function create(): ShowLeaderboardAction {
  return {
    kind: MetaActionKind.ShowLeaderboard
  };
}
