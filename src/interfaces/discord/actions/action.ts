import { EffectAction, EffectActionType } from "./effect_action";
import { MetaAction, MetaActionType } from "./meta_action";

export const ActionType = { ...EffectActionType, ...MetaActionType };
export type Action = EffectAction | MetaAction;

export { DiscordActionHandler } from "./action_handler";
