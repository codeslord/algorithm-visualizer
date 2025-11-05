import { Array1DTracer } from './Array1DTracer';
import { ChartRenderer } from '@/components/renderers/ChartRenderer';

export class ChartTracer extends Array1DTracer {
  getRendererClass() {
    return ChartRenderer;
  }
}
