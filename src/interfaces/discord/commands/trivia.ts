import { createCommand, Message } from "../../../lib/discord";
import TriviaQuestions = require("@it-could-be/trivia-questions");

const { QuestionType, getRandomQuestion } = TriviaQuestions;

function processMultipleAnswerQuestion(
  message: Message,
  question: TriviaQuestions.MultipleAnswerQuestion
) {
  message.channel.send(question.detail.text);
}

export const createTriviaCommand = () =>
  createCommand("trivia", (message: Message) => {
    let randomQuestion = getRandomQuestion();
    switch (randomQuestion.question_type_id) {
      case QuestionType.MULTIPLE_ANSWER:
        processMultipleAnswerQuestion(message, randomQuestion);
    }
  });
