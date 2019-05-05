export interface User {
  userId: string;
  score: number;
  name?: string;
}

export interface Channel {
  channelId: string;
  activeQuestion: {
    id: string;
  };
}

export interface Server {
  serverId: string;
  channels: Map<string, Channel>;
  users: Map<string, User>;
}
