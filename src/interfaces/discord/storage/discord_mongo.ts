import pino = require("pino");
import mongoose = require("mongoose");
import { DiscordStorage } from "./discord_storage";
import { Maybe, None } from "../../../lib/types";

interface ChannelModel extends mongoose.Document {
  channelId: string;
  activeQuestion: {
    id: string;
  };
}
const ChannelSchema = new mongoose.Schema<ChannelModel>({
  channelId: { type: String },
  activeQuestion: {
    type: {
      id: {
        type: String
      }
    }
  }
});

interface ServerModel extends mongoose.Document {
  serverId: string;
  channels: Map<string, ChannelModel>;
}
const ServerSchema = new mongoose.Schema<ServerModel>({
  serverId: { type: String },
  channels: {
    type: Map,
    of: ChannelSchema
  }
});

function registerModels(conn: mongoose.Connection) {
  return {
    Server: conn.model<ServerModel>("Server", ServerSchema)
  };
}

type MongoQuery<T> = {
  name: string;
  fn: (models: Models) => Promise<[any, T]>;
};

/**
 * Wraps a function that executes a Mongo query, providing logging
 * and null check for the models.
 */
function runMongoQuery<T>(logger: pino.Logger, models?: Models) {
  return function(query: MongoQuery<T>): Promise<[any, T]> {
    if (!models) {
      return Promise.reject("No Models");
    }

    return query.fn(models).then(([err, result]) => {
      logger.debug({ query: query.name, err, result }, `Ran Query`);
      if (err) {
        throw err;
      }
      return [err, result] as [any, T];
    });
  };
}

type Models = {
  Server: mongoose.Model<ServerModel>;
};

export class DiscordMongoStorage implements DiscordStorage {
  private uri: string;
  private logger: pino.Logger;
  private conn?: mongoose.Connection;
  private models?: {
    Server: mongoose.Model<ServerModel>;
  };

  constructor(uri: string, logger: pino.Logger) {
    this.uri = uri;
    this.logger = logger;
  }

  connect() {
    let conn = mongoose.createConnection(this.uri);
    this.conn = conn;
    this.models = registerModels(this.conn);
  }

  setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string | null
  ): Promise<any> {
    if (!questionId) {
      return this.cancelActiveQuestion(serverId, channelId);
    }
    return runMongoQuery<any>(this.logger, this.models)({
      name: `setActiveQuestion(${serverId},${channelId},${questionId})`,
      fn: (models: Models) => {
        return new Promise(resolve => {
          models.Server.update(
            {
              serverId
            },
            {
              $set: {
                [`channels.${channelId}.activeQuestion.id`]: questionId
              }
            },
            { upsert: true },
            (...args) => {
              resolve(args);
            }
          );
        });
      }
    });
  }

  cancelActiveQuestion(serverId: string, channelId: string): Promise<any> {
    return runMongoQuery<any>(this.logger, this.models)({
      name: `cancelActiveQuestion(${serverId},${channelId})`,
      fn: (models: Models) => {
        return new Promise(resolve => {
          models.Server.update(
            {
              serverId
            },
            {
              $unset: {
                [`channels.${channelId}.activeQuestion`]: 1
              }
            },
            (...args) => resolve(args)
          );
        });
      }
    });
  }

  getActiveQuestion(
    serverId: string,
    channelId: string
  ): Promise<Maybe<string>> {
    return runMongoQuery<ServerModel>(this.logger, this.models)({
      name: `getActiveQuestion(${serverId},${channelId})`,
      fn: (models: Models) => {
        return new Promise(resolve => {
          models.Server.findOne(
            {
              serverId,
              [`channels.${channelId}.activeQuestion`]: { $exists: true }
            },
            {
              serverId: 1,
              [`channels.${channelId}.activeQuestion`]: 1
            },
            (err, server: ServerModel) => {
              resolve([err, server]);
            }
          );
        });
      }
    }).then(([err, server]) => {
      if (err) {
        throw err;
      }
      if (!server) {
        return None;
      }
      let channel = server.channels!.get(channelId);
      if (!channel!.activeQuestion) {
        return None;
      }
      return channel!.activeQuestion.id;
    });
  }
}
