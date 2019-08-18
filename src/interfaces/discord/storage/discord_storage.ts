import { Maybe } from "../../../lib/types";
import { User } from "./models";

export interface DiscordStorage {
  setActiveQuestion(
    channelId: string,
    questionId: string | null
  ): Promise<void>;

  cancelActiveQuestion(channelId: string): Promise<void>;

  getActiveQuestion(channelId: string): Promise<Maybe<string>>;

  getUserScore(serverId: string, userId: string): Promise<number>;

  updateScore(
    serverId: string,
    userId: string,
    increase: number
  ): Promise<void>;

  getTopScores(serverId: string): Promise<Array<User>>;
}
