import pino = require("pino");
import mongoose = require("mongoose");
import { DiscordStorage } from "./discord_storage";
import { Maybe, None } from "../../../lib/types";

interface UserModel extends mongoose.Document {
  userId: string;
  score: number;
}
const UserSchema = new mongoose.Schema<UserModel>({
  userId: { type: String },
  score: { type: Number }
});

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
  users: Map<string, UserModel>;
}
const ServerSchema = new mongoose.Schema<ServerModel>({
  serverId: { type: String },
  channels: {
    type: Map,
    of: ChannelSchema
  },
  users: {
    type: Map,
    of: UserSchema
  }
});

function registerModels(conn: mongoose.Connection) {
  return {
    Server: conn.model<ServerModel>("Server", ServerSchema)
  };
}

type MongoQuery<T> = {
  name: string;
  fn: (models: Models) => Promise<T>;
};

/**
 * Wraps a function that executes a Mongo query, providing logging
 * and null check for the models.
 */
function runMongoQuery<T>(logger: pino.Logger, models?: Models) {
  return async function(query: MongoQuery<T>): Promise<T> {
    if (!models) {
      throw new Error("No Models");
    }

    let result = await query.fn(models);
    logger.debug({ query: query.name, result }, `Ran Query`);
    return result as T;
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

  async setActiveQuestion(
    serverId: string,
    channelId: string,
    questionId: string | null
  ): Promise<void> {
    if (!questionId) {
      return this.cancelActiveQuestion(serverId, channelId);
    }
    await runMongoQuery<void>(this.logger, this.models)({
      name: `setActiveQuestion(${serverId},${channelId},${questionId})`,
      fn: async (models: Models) => {
        let query = models.Server.update(
          {
            serverId
          },
          {
            $set: {
              [`channels.${channelId}.activeQuestion.id`]: questionId
            }
          },
          { upsert: true }
        );
        return query.exec();
      }
    });
    return;
  }

  async cancelActiveQuestion(
    serverId: string,
    channelId: string
  ): Promise<any> {
    await runMongoQuery<any>(this.logger, this.models)({
      name: `cancelActiveQuestion(${serverId},${channelId})`,
      fn: (models: Models) => {
        let query = models.Server.update(
          {
            serverId
          },
          {
            $unset: {
              [`channels.${channelId}.activeQuestion`]: 1
            }
          }
        );
        return query.exec();
      }
    });
    return;
  }

  async getActiveQuestion(
    serverId: string,
    channelId: string
  ): Promise<Maybe<string>> {
    let server = await runMongoQuery<ServerModel | null>(
      this.logger,
      this.models
    )({
      name: `getActiveQuestion(${serverId},${channelId})`,
      fn: async (models: Models) => {
        let query = models.Server.findOne(
          {
            serverId,
            [`channels.${channelId}.activeQuestion`]: { $exists: true }
          },
          {
            serverId: 1,
            [`channels.${channelId}.activeQuestion`]: 1
          }
        );
        return query.exec();
      }
    });

    if (!server) {
      return None;
    }

    let channel = server.channels!.get(channelId);
    if (!channel!.activeQuestion) {
      return None;
    }
    return channel!.activeQuestion.id;
  }

  async getUserScore(
    serverId: string,
    userId: string
  ): Promise<UserModel["score"]> {
    let server = await runMongoQuery<ServerModel | null>(
      this.logger,
      this.models
    )({
      name: `getUserScore(${serverId},${userId})`,
      fn: async (models: Models) => {
        return models.Server.findOne(
          {
            serverId
          },
          {
            serverId: 1,
            [`users.${userId}.score`]: 1
          }
        ).exec();
      }
    });
    if (!server || !server.get("users") || !server.get("users").get(userId)) {
      return 0;
    }
    return server
      .get("users")
      .get(userId)!
      .get("score");
  }

  async updateScore(serverId: string, userId: string, increase: number) {
    await runMongoQuery<void>(this.logger, this.models)({
      name: `addScore(${serverId},${userId},${increase})`,
      fn: async (models: Models) => {
        await models.Server.update(
          {
            serverId
          },
          {
            $inc: {
              [`users.${userId}.score`]: 1
            }
          }
        ).exec();
      }
    });
    return;
  }
}
