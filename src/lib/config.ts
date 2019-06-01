export type Config = {
  db: {
    uri?: string;
  };
};

export function createConfig() {
  let { DB_URI, DISCORD_TOKEN } = process.env;
  if (!DB_URI) {
    throw new Error("DB_URI not found");
  }
  if (!DISCORD_TOKEN) {
    throw new Error("DISCORD_TOKEN not found");
  }
  return {
    db: {
      uri: process.env.DB_URI
    },
    discord: {
      token: DISCORD_TOKEN
    }
  };
}
