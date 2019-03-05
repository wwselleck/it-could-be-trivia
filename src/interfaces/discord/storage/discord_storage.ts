import { Maybe } from "../../../lib/types";

export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string | null
  ): void;

  cancelActiveQuestion(serverId: string, channelId: string): void;

  getActiveQuestion(serverId: string, channelId: string): Maybe<string>;
}
