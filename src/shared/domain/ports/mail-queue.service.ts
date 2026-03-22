export interface JobOptions {
  delay?: number;
  attempts?: number;
  priority?: number;
}

export interface IMailQueueService {
  enqueueSendMail(data: unknown, options: JobOptions): Promise<void>;
}
