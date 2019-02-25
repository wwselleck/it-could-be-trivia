declare module "@it-could-be/trivia-questions" {
  // The const here makes it so the enum is exported
  // as a usuable value, not just a type.
  // Idk why.
  // https://stackoverflow.com/questions/50564756/exporting-enum-from-typescript-type-definition-file
  // It should probably just be exported from the actual package
  export const enum QuestionType {
    MULTIPLE_ANSWER = "multiple_answer",
    SINGLE_ANSWER = "single_answer",
    MULTIPLE_CHOICE = "multiple_choice"
  }

  export interface BaseQuestion {
    id: string;
    question_type_id: string;
    category_id: string;
    detail: Object;
  }

  export interface MultipleAnswerQuestion extends BaseQuestion {
    question_type_id: QuestionType.MULTIPLE_ANSWER;
    detail: {
      text: string;
      answer: Array<string>;
    };
  }

  export interface SingleAnswerQuestion extends BaseQuestion {
    question_type_id: "single_answer";
    detail: {
      text: string;
      answer: string;
    };
  }

  export interface MultipleChoiceQuestion extends BaseQuestion {
    question_type_id: "multiple_choice";
    detail: {
      text: string;
      choices: Array<string>;
      answer: string;
    };
  }

  export type Question =
    | MultipleAnswerQuestion
    | SingleAnswerQuestion
    | MultipleChoiceQuestion;

  export function getRandomQuestion(): Question;
}
