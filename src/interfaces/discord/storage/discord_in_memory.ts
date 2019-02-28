import { Maybe, None } from "../../../lib/types";

type ChannelSchema = {
  id: string;
  activeQuestionId: string | null;
};

type ServerSchema = {
  id: string;
  channels: { [key: string]: ChannelSchema };
};

type Schema = {
  servers: { [key: string]: ServerSchema };
};

/**
 * REFACTOR THESE TO TAKE FUNCTION THAT TAKE THE CURRENT OBJECT
 * AND RETURN A NEW ONE
 * THATS SO MUCH BETTER
 * DO THIS NEXT
 */
const updateChannel = (
  schema: Schema,
  serverId: string,
  channelId: string,
  update: Partial<ChannelSchema>
): Schema => {
  let server = schema.servers[serverId];
  let channel = schema.servers[serverId].channels[channelId];
  let newChannels = {
    ...server.channels,
    [channelId]: {
      ...channel,
      ...update
    }
  };
  return updateServer(schema, serverId, { channels: newChannels });
};

const updateServer = (
  data: Schema,
  serverId: string,
  update: Partial<ServerSchema>
) => {
  let server = data.servers[serverId];
  return {
    ...data,
    servers: {
      ...data.servers,
      [serverId]: {
        ...server,
        ...update
      }
    }
  };
};

const ensureServer = (data: Schema, serverId: string): Schema => {
  if (data.servers[serverId]) {
    return data;
  }
  let newServers = {
    ...data.servers,
    [serverId]: {
      id: serverId,
      channels: {}
    }
  };
  return {
    ...data,
    servers: newServers
  };
};

const ensureChannel = (
  data: Schema,
  serverId: string,
  channelId: string
): Schema => {
  let server = data.servers[serverId];
  if (server.channels[channelId]) {
    return data;
  }
  return {
    ...data,
    servers: {
      ...data.servers,
      [serverId]: {
        ...server,
        channels: {
          ...server.channels,
          [channelId]: {
            id: channelId,
            activeQuestionId: null
          }
        }
      }
    }
  };
};

const getChannel = (data: Schema, serverId: string, channelId: string) => {
  let server = data.servers[serverId];
  if (!server) {
    return None;
  }

  let channel = server.channels[channelId];
  return channel || None;
};

export class DiscordInMemoryStorage {
  data: Schema;
  constructor() {
    this.data = {
      servers: {}
    };
  }

  setActiveQuestion(serverId: string, channelId: string, questionId: string) {
    let data = this.data;
    data = ensureServer(data, serverId);
    data = ensureChannel(data, serverId, channelId);
    data = updateChannel(data, serverId, channelId, {
      activeQuestionId: questionId
    });
    this.data = data;
    console.log(JSON.stringify(this.data, null, 2));
  }

  getActiveQuestion(serverId: string, channelId: string): Maybe<string> {
    let channel = getChannel(this.data, serverId, channelId);
    if (channel === None) {
      return None;
    }
    return channel.activeQuestionId || None;
  }
}
