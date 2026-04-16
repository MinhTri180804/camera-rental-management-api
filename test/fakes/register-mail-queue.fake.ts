export class FakeRegisterMailQueue {
  public jobs: {
    name: string;
    data: { otp: string; email: string; expiresAt: number };
  }[] = [];

  add(name: string, data: { otp: string; email: string; expiresAt: number }) {
    this.jobs.push({ name, data });
    return;
  }

  clear() {
    this.jobs = [];
  }
}
