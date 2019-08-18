export interface User {
  userId: string;
  score: number;
  name?: string;
}

export interface Channel {
  serverId: string;
  channelId: string;
  activeQuestion: {
    id: string;
  };
}

export interface Server {
  serverId: string;
  users: Map<string, User>;
}
