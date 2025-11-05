import { Tracer, GetObjectFunction } from './Tracer';

export class LogTracer extends Tracer {
  logs: string[];

  constructor(key: string, getObject: GetObjectFunction, title: string) {
    super(key, getObject, title);
    this.logs = [];
  }

  init(): void {
    super.init();
    this.logs = [];
  }

  set(logs: string[] = []): void {
    this.logs = [...logs];
  }

  print(message: string): void {
    const lastLog = this.logs[this.logs.length - 1];
    if (lastLog !== undefined) {
      this.logs[this.logs.length - 1] = lastLog + message;
    } else {
      this.logs.push(message);
    }
  }

  println(message: string): void {
    this.logs.push(message);
  }

  printf(format: string, ...args: any[]): void {
    // Simple sprintf-like implementation
    let output = format;
    args.forEach((arg, i) => {
      output = output.replace(new RegExp(`%[sd]`, ''), String(arg));
    });
    this.print(output);
  }
}

export default LogTracer;
