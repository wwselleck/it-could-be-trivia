import { ShowLeaderboard } from "../../actions";
import { MessageContext } from "../../../message_context";

export const leaderboardHandler = (_: MessageContext) => {
  return [ShowLeaderboard.create()];
};
