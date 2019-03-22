import { Maybe } from "../../../lib/types";

export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string | null
  ): Promise<void>;

  cancelActiveQuestion(serverId: string, channelId: string): void;

  getActiveQuestion(serverId: string, channelId: string): Promise<Maybe<string>>;
}
