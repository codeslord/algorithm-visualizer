import { Tracer } from './Tracer';
import { LogRenderer } from '@/components/renderers/LogRenderer';

export class LogTracer extends Tracer {
  log: string = '';

  getRendererClass() {
    return LogRenderer;
  }

  set(log: string = '') {
    this.log = log;
    super.set();
  }

  print(message: string) {
    this.log += message;
  }

  println(message: string) {
    this.print(message + '\n');
  }

  printf(format: string, ...args: any[]) {
    // Simple sprintf implementation
    let result = format;
    let argIndex = 0;

    result = result.replace(/%([sd])/g, (match, type) => {
      if (argIndex >= args.length) return match;
      const arg = args[argIndex++];
      return type === 's' ? String(arg) : Number(arg).toString();
    });

    this.print(result);
  }
}
