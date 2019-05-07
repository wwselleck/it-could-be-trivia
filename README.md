# It Could Be Trivia
<img src="https://i.imgur.com/VbjEYJy.jpg" width="200px" />
A chat trivia bot

## Get Started
Right now, the only option for using this bot is by cloning it and hosting it yourself.

### Dependencies
- Node >=8.0.0
- Yarn
- MongoDB (not necessarily on your own machine, but you'll need one somewhere)

### Install

1. Go to `https://discordapp.com/` and register an application
2. Note your bot application's `client id`, and copy into this URL: `https://discordapp.com/oauth2/authorize?&client_id=[YOUR_CLIENT_ID]&scope=bot` to add the bot user into whatever server you want.
3. Go to the "bot" tab on your Discord application and copy the `token`.
3. `git clone https://github.com/wwselleck/it-could-be-trivia.git` - Clone this repo
4. `yarn` - Install dependencies
5. `DISCORD_TOKEN=[YOUR_TOKEN] DB_URI=[YOUR_MONGO_URI] yarn start` - Start the bot

## Config
All config is passed into the program via environment variables.

`DISCORD_TOKEN` - The token for the discord bot user you want to connect the trivia bot to

`DB_URI` - URI to the MongoDB instance you want to connect to

`LOG_LEVEL` - `info|debug|trace` The error level you want for the logs

## Usage

`!t` or `!trivia` - Ask for a trivia question

`!t [c|cancel]` - Cancel the currently active question

`!t caq` - Cancel the active question and reveal the answer

`[any]` - Any message received while there is an active question will be interpreted as an answer attempt

## Development
todo
