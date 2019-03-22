export type Config = {
  db: {
    uri?: string;
  };
};

export function createConfig() {
  return {
    db: {
      uri: process.env.DB_URI
    }
  };
}
