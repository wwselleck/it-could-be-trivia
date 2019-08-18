import pino = require("pino");
import mongoose = require("mongoose");
import { DiscordStorage } from "./discord_storage";
import { Maybe, None } from "../../../lib/types";
import { Server, Channel, User } from "./models";

interface UserModel extends User, mongoose.Document {}

const UserSchema = new mongoose.Schema<UserModel>({
  userId: { type: String },
  score: { type: Number }
});

interface ChannelModel extends Channel, mongoose.Document {}

const ChannelSchema = new mongoose.Schema<ChannelModel>({
  channelId: { type: String },
  activeQuestion: {
    type: {
      id: {
        type: String
      }
    }
  }
  //preferences: {
  //type: {
  //questionInterval: Number
  //}
  //},
  //lastAutomatedQuestionSent: Date
});

interface ServerModel extends Server, mongoose.Document {}

const ServerSchema = new mongoose.Schema<ServerModel>({
  serverId: { type: String },
  users: {
    type: Map,
    of: UserSchema
  }
});

function registerModels(conn: mongoose.Connection) {
  return {
    Server: conn.model<ServerModel>("Server", ServerSchema),
    Channel: conn.model<ChannelModel>("Channel", ChannelSchema)
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
  Channel: mongoose.Model<ChannelModel>;
};

export class DiscordMongoStorage implements DiscordStorage {
  private uri: string;
  private logger: pino.Logger;
  private conn?: mongoose.Connection;
  private models?: {
    Server: mongoose.Model<ServerModel>;
    Channel: mongoose.Model<ChannelModel>;
  };

  constructor(uri: string, logger: pino.Logger) {
    this.uri = uri;
    this.logger = logger;
  }

  connect() {
    let conn = mongoose.createConnection(this.uri, { useNewUrlParser: true });
    this.conn = conn;
    this.models = registerModels(this.conn);
  }

  async setActiveQuestion(
    channelId: string,
    questionId: string | null
  ): Promise<void> {
    if (!questionId) {
      return this.cancelActiveQuestion(channelId);
    }
    await runMongoQuery<void>(this.logger, this.models)({
      name: `setActiveQuestion(${channelId},${questionId})`,
      fn: async (models: Models) => {
        let query = models.Channel.update(
          {
            channelId
          },
          {
            $set: {
              [`activeQuestion.id`]: questionId
            }
          },
          { upsert: true }
        );
        return query.exec();
      }
    });
    return;
  }

  async cancelActiveQuestion(channelId: string): Promise<any> {
    await runMongoQuery<any>(this.logger, this.models)({
      name: `cancelActiveQuestion(${channelId})`,
      fn: (models: Models) => {
        let query = models.Channel.update(
          {
            channelId
          },
          {
            $unset: {
              [`activeQuestion`]: 1
            }
          }
        );
        return query.exec();
      }
    });
    return;
  }

  async getActiveQuestion(channelId: string): Promise<Maybe<string>> {
    let channel = await runMongoQuery<ChannelModel | null>(
      this.logger,
      this.models
    )({
      name: `getActiveQuestion(${channelId})`,
      fn: async (models: Models) => {
        let query = models.Channel.findOne(
          {
            channelId
          },
          {
            activeQuestion: 1
          }
        );
        return query.exec();
      }
    });

    if (!channel || !channel.activeQuestion) {
      return None;
    }
    return channel.activeQuestion.id;
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
            [`users.${userId}.userId`]: userId,
            $inc: {
              [`users.${userId}.score`]: 1
            }
          }
        ).exec();
      }
    });
    return;
  }

  async getTopScores(serverId: string): Promise<Array<User>> {
    let server = await runMongoQuery<ServerModel | null>(
      this.logger,
      this.models
    )({
      name: `getTopScores(${serverId})`,
      fn: async (models: Models) => {
        return models.Server.findOne(
          {
            serverId
          },
          {
            users: 1
          }
        ).exec();
      }
    });
    if (!server) {
      return [];
    }
    let users: Array<User> = Array.from<UserModel>(
      server.get("users").values()
    ).map(u => u.toObject());
    let sortedUsers = users.sort((u1: User, u2: User) => u2.score - u1.score);
    return sortedUsers;
  }

  async getChannelsDueForAutomatedQuestion(): Promise<Array<User>> {}
}
