import { CancelActiveQuestion } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";

export const handle = ({ message, storage }: ActionHandlerInfo) => (
  _: CancelActiveQuestion
) => {
  storage.cancelActiveQuestion(message.guild.id, message.channel.id);
};
