class ChannelSchema {
  id: string;
  activeQuestionId: string | null;

  constructor(id: string) {
    this.id = id;
    this.activeQuestionId = null;
  }

  setActiveQuestion(questionId: string) {
    this.activeQuestionId = questionId;
  }

  getActiveQuestion() {
    return this.activeQuestionId;
  }

  toJSON() {
    return {
      id: this.id,
      activeQuestionId: this.activeQuestionId
    };
  }
}

export class ServerSchema {
  id: string;
  channels: { [key: string]: ChannelSchema };

  constructor(id: string) {
    this.id = id;
    this.channels = {};
  }

  channel(channelId: string): ChannelSchema {
    let channel = this.channels[channelId];
    if (!channel) {
      let newChannel = new ChannelSchema(channelId);
      this.channels[channelId] = newChannel;
      channel = newChannel;
    }
    return channel;
  }

  toJSON() {
    return {
      id: this.id,
      channels: this.channels
    };
  }
}

export class Schema {
  servers: { [key: string]: ServerSchema };
  constructor() {
    this.servers = {};
  }

  server(serverId: string): ServerSchema {
    let server = this.servers[serverId];
    if (!server) {
      let newServer = new ServerSchema(serverId);
      this.servers[serverId] = newServer;
      server = newServer;
    }
    return server;
  }

  toJSON() {
    return {
      servers: this.servers
    };
  }
}

export class DiscordInMemoryStorage {
  data: Schema;
  constructor() {
    this.data = new Schema();
  }

  setActiveQuestion(serverId: string, channelId: string, questionId: string) {
    let server = this.data.server(serverId);
    let channel = server.channel(channelId);
    channel.setActiveQuestion(questionId);
    console.log(questionId);
    console.log(JSON.stringify(this.data, null, 2));
  }

  getActiveQuestion(serverId: string, channelId: string): string | null {
    let server = this.data.server(serverId);
    console.log(server);
    let channel = server.channel(channelId);
    console.log(channel);
    return channel.getActiveQuestion();
  }

  toJSON() {
    return this.data.toJSON();
  }
}
