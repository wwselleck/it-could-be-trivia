import { Action, EffectActionKind, ShowLeaderboard } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";
import { contentForLeaderboard } from "./util";

export async function handle(
  _: ShowLeaderboard,
  config: ActionHandlerInfo
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
  return [
    {
      kind: EffectActionKind.Reply,
      payload: {
        content: contentForLeaderboard(topUsersWithNames)
      }
    }
  ];
}
