type UpdateActiveQuestion = {
  kind: "updateActiveQuestion";
  payload: {
    questionId: string;
  };
};

type Reply = {
  kind: "reply";
  payload: {
    content: string;
  };
};

export type Action = UpdateActiveQuestion | Reply;

// Destructive
export class DiscordActionHandler {
  handle(actions: Array<Action>) {
    console.log(JSON.stringify(actions, null, 2));
  }
}
