import { UpdateActiveQuestion } from "src/actions";
import { ActionHandlerInfo } from "src/interfaces/discord/discord_action_handler";

export const handle = ({ message, storage }: ActionHandlerInfo) => async (
  action: UpdateActiveQuestion
) => {
  await storage.setActiveQuestion(
    message.guild.id,
    message.channel.id,
    action.payload.questionId
  );
};
