export class ForgotPasswordMailQueueFake {
  public jobs: {
    name: string;
    data: { otp: string; email: string; expiresAt: number };
  }[] = [];

  add(name: string, data: { otp: string; email: string; expiresAt: number }) {
    this.jobs.push({ name, data });
  }

  clear() {
    this.jobs = [];
  }
}
