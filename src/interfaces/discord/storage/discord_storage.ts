import * as TriviaQuestions from "@it-could-be/trivia-questions";
import { Maybe } from "../../../lib/types";
import { User } from "./models";

export interface DiscordStorage {
  setActiveQuestion(
    serverId: string,
    channelId: string,
    question: TriviaQuestions.Question | null
  ): Promise<void>;

  cancelActiveQuestion(serverId: string, channelId: string): Promise<void>;

  getActiveQuestion(
    serverId: string,
    channelId: string
  ): Promise<Maybe<string>>;

  getUserScore(serverId: string, userId: string): Promise<number>;

  updateScore(
    serverId: string,
    userId: string,
    increase: number
  ): Promise<void>;

  getTopScores(serverId: string): Promise<Array<User>>;
}
