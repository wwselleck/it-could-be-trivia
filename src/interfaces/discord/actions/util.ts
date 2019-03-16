import TriviaQuestions = require("@it-could-be/trivia-questions");

function contentForSingleAnswerQuestion(
  question: TriviaQuestions.SingleAnswerQuestion
) {
  return question.detail.text;
}

export function contentForQuestion(question: TriviaQuestions.Question): string {
  switch (question.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return contentForSingleAnswerQuestion(question);
      break;
    default:
      return "Gimme a single answer question";
      break;
  }
}
