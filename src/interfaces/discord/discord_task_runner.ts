import { logger } from "src/lib/logger";

type Task = {
  name: string;
  fn: () => Promise<void>;
  interval: number;
};

class TaskRunner {
  task: Task;
  interval: NodeJS.Timeout | null;

  constructor(task: Task) {
    this.task = task;
    this.interval = null;
  }

  start() {
    if (this.interval) {
      logger.info(
        `Attempted to start task ${this.task.name} that was already running`
      );
      return;
    }

    this.interval = setInterval(async () => {
      logger.debug(`Running task ${this.task.name}...`);
      await this.task.fn();
      logger.debug(`Finished task ${this.task.name}`);
    }, this.task.interval);
    logger.info(`Started interval for task ${this.task.name}`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

export class DiscordTaskRunner {
  constructor() {}

  start() {}

  stop() {}
}
