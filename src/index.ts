import * as DiscordInterface from "./interfaces/discord/discord";
import { DiscordInMemoryStorage } from "./interfaces/discord/storage/discord_in_memory";

try {
  new DiscordInterface.DiscordInterface({
    token: process.env.DISCORD_TOKEN || "",
    storage: new DiscordInMemoryStorage()
  }).connect();
} catch (e) {
  console.error(e.toString());
}
