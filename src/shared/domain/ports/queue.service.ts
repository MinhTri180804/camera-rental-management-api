export interface JobOptions {
  delay?: number;
  attempts?: number;
  priority?: number;
}

export interface IQueueService<JobData> {
  addJob(jobName: string, data: JobData, options?: JobOptions): Promise<void>;
}
