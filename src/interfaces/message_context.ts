import * as TriviaQuestions from "@it-could-be/trivia-questions";

export type MessageContext = {
  message: {
    content: string;
    sender: {
      id: string;
      username: string;
      score: number;
    };
  };
  activeQuestion: TriviaQuestions.Question | null;
};
