import { Tracer } from './Tracer';
import { Array2DRenderer } from '@/components/renderers/Array2DRenderer';

export class Element {
  value: number;
  patched: boolean;
  selected: boolean;

  constructor(value: number) {
    this.value = value;
    this.patched = false;
    this.selected = false;
  }
}

export class Array2DTracer extends Tracer {
  data: Element[][] = [];

  getRendererClass(): React.ComponentType<any> {
    return Array2DRenderer as any;
  }

  set(array2d: any = []) {
    // Handle both number[] and number[][]
    const normalizedArray = Array.isArray(array2d[0]) ? array2d : [array2d];
    this.data = normalizedArray.map((array1d: number[]) =>
      [...array1d].map((value: number) => new Element(value))
    );
    super.set();
  }

  patch(x: number, y: number, v?: number) {
    if (!this.data[x]) this.data[x] = [];
    if (!this.data[x][y]) this.data[x][y] = new Element(0);

    if (v !== undefined) {
      this.data[x][y].value = v;
    }
    this.data[x][y].patched = true;
  }

  depatch(x: number, y: number) {
    if (this.data[x] && this.data[x][y]) {
      this.data[x][y].patched = false;
    }
  }

  select(sx: number, sy: number, ex: number = sx, ey: number = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        if (this.data[x] && this.data[x][y]) {
          this.data[x][y].selected = true;
        }
      }
    }
  }

  selectRow(x: number, sy: number, ey: number) {
    this.select(x, sy, x, ey);
  }

  selectCol(y: number, sx: number, ex: number) {
    this.select(sx, y, ex, y);
  }

  deselect(sx: number, sy: number, ex: number = sx, ey: number = sy) {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        if (this.data[x] && this.data[x][y]) {
          this.data[x][y].selected = false;
        }
      }
    }
  }

  deselectRow(x: number, sy: number, ey: number) {
    this.deselect(x, sy, x, ey);
  }

  deselectCol(y: number, sx: number, ex: number) {
    this.deselect(sx, y, ex, y);
  }
}
