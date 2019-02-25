export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string
  ): void;

  getActiveQuestion(serverId: string, channelId: string): string | null;
}
