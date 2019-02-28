import { Maybe } from "../../../lib/types";

export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string
  ): void;

  getActiveQuestion(serverId: string, channelId: string): Maybe<string>;
}
