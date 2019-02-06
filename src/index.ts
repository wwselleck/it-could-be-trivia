import { createDiscordInterface, connect } from "./interfaces/discord/discord";

let d = createDiscordInterface({
  token: process.env.DISCORD_TOKEN || ""
});

connect(d);
