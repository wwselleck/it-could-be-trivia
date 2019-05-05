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
    default:
      return "Gimme a single answer question";
  }
}

export function answerForQuestion(question: TriviaQuestions.Question): string {
  switch (question.question_type_id) {
    case TriviaQuestions.QuestionType.SingleAnswer:
      return TriviaQuestions.Answer.SingleAnswerQuestion.getAnswer(question);
    default:
      return "Gimme a single answer question";
  }
}
