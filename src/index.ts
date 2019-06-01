import pino = require("pino");
import { logger } from "./lib/logger";
import * as Config from "./lib/config";
import * as DiscordInterface from "./interfaces/discord/discord";
import { DiscordMongoStorage } from "./interfaces/discord/storage/discord_mongo";

function createStorage(config: Config.Config, logger: pino.Logger) {
  let uri = config.db.uri;
  if (!uri) {
    throw new Error("No Mongo URI specified");
  }
  return new DiscordMongoStorage(uri, logger);
}

(async () => {
  try {
    let config = Config.createConfig();
    let storage = createStorage(config, logger);
    await storage.connect();
    new DiscordInterface.DiscordInterface({
      token: process.env.DISCORD_TOKEN || "",
      storage,
      logger
    }).connect();
  } catch (e) {
    console.error(e.toString());
  }
})();
