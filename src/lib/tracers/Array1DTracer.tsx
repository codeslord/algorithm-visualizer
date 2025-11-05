import { Array2DTracer } from './Array2DTracer';
import { Array1DRenderer } from '@/components/renderers/Array1DRenderer';

export class Array1DTracer extends Array2DTracer {
  chartTracer: any = null;

  getRendererClass(): React.ComponentType<any> {
    return Array1DRenderer as any;
  }

  init() {
    super.init();
    this.chartTracer = null;
  }

  set(array1d: any = []) {
    // Pass as-is to parent which will handle both 1D and 2D
    super.set(array1d);
    this.syncChartTracer();
  }

  patch(x: number, v?: number) {
    super.patch(0, x, v);
  }

  depatch(x: number) {
    super.depatch(0, x);
  }

  select(sx: number, ex: number = sx) {
    super.select(0, sx, 0, ex);
  }

  deselect(sx: number, ex: number = sx) {
    super.deselect(0, sx, 0, ex);
  }

  chart(key: string) {
    this.chartTracer = key ? this.getObject(key) : null;
    this.syncChartTracer();
  }

  syncChartTracer() {
    if (this.chartTracer) {
      this.chartTracer.data = this.data;
    }
  }
}
