import { UpdateSenderScore } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";

export const handle = ({ message, storage }: ActionHandlerInfo) => async (
  action: UpdateSenderScore
) => {
  await storage.updateScore(
    message.guild.id,
    message.author.id,
    action.payload.amount
  );
};
