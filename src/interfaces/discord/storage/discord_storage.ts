import { Maybe } from "../../../lib/types";

export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string | null
  ): Promise<void>;

  cancelActiveQuestion(serverId: string, channelId: string): Promise<void>;

  getActiveQuestion(
    serverId: string,
    channelId: string
  ): Promise<Maybe<string>>;

  getUserScore(serverId: string, userId: string): Promise<number>;

  updateScore(
    serverId: string,
    userId: string,
    increase: number
  ): Promise<void>;
}
