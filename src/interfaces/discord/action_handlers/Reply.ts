import { Reply } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";

export const handle = ({ message }: ActionHandlerInfo) => (action: Reply) => {
  message.channel.send(action.payload.content);
};
