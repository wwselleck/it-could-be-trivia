import { ShowLeaderboard } from "src/actions";
import { MessageContext } from "src/message_context";

export const leaderboardHandler = (_: MessageContext) => {
  return [ShowLeaderboard.create()];
};
