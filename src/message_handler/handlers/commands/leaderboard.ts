import { Action, MetaActionKind } from "src/actions";
import { MessageContext } from "src/message_context";

export const leaderboardHandler = (_: MessageContext): Array<Action> => {
  return [
    {
      kind: MetaActionKind.ShowLeaderboard
    }
  ];
};
