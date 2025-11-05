import { Array2DTracer } from './Array2DTracer';
import { GetObjectFunction } from './Tracer';

export class Array1DTracer extends Array2DTracer {
  chartTracer: any = null;

  constructor(key: string, getObject: GetObjectFunction, title: string) {
    super(key, getObject, title);
  }

  init(): void {
    super.init();
    this.chartTracer = null;
  }

  set(array1d: any[] = []): void {
    const array2d = [array1d];
    super.set(array2d);
    this.syncChartTracer();
  }

  patch(x: number, v: any): void {
    super.patch(0, x, v);
  }

  depatch(x: number): void {
    super.depatch(0, x);
  }

  select(sx: number, ex: number = sx): void {
    super.select(0, sx, 0, ex);
  }

  deselect(sx: number, ex: number = sx): void {
    super.deselect(0, sx, 0, ex);
  }

  chart(key?: string): void {
    this.chartTracer = key ? this.getObject(key) : null;
    this.syncChartTracer();
  }

  syncChartTracer(): void {
    if (this.chartTracer) {
      this.chartTracer.data = this.data;
    }
  }
}

export default Array1DTracer;
