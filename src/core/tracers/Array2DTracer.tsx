import { Tracer, GetObjectFunction } from './Tracer';

export class Element {
  value: any;
  patched: boolean;
  selected: boolean;

  constructor(value: any) {
    this.value = value;
    this.patched = false;
    this.selected = false;
  }
}

export class Array2DTracer extends Tracer {
  data: Element[][];

  constructor(key: string, getObject: GetObjectFunction, title: string) {
    super(key, getObject, title);
    this.data = [];
  }

  set(array2d: any[][] = []): void {
    this.data = array2d.map(array1d =>
      [...array1d].map(value => new Element(value))
    );
  }

  patch(x: number, y: number, v: any = this.data[x]?.[y]?.value): void {
    if (!this.data[x]) this.data[x] = [];
    if (!this.data[x][y]) this.data[x][y] = new Element(v);
    this.data[x][y].value = v;
    this.data[x][y].patched = true;
  }

  depatch(x: number, y: number): void {
    if (this.data[x]?.[y]) {
      this.data[x][y].patched = false;
    }
  }

  select(sx: number, sy: number, ex: number = sx, ey: number = sy): void {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        if (this.data[x]?.[y]) {
          this.data[x][y].selected = true;
        }
      }
    }
  }

  selectRow(x: number, sy: number, ey: number): void {
    this.select(x, sy, x, ey);
  }

  selectCol(y: number, sx: number, ex: number): void {
    this.select(sx, y, ex, y);
  }

  deselect(sx: number, sy: number, ex: number = sx, ey: number = sy): void {
    for (let x = sx; x <= ex; x++) {
      for (let y = sy; y <= ey; y++) {
        if (this.data[x]?.[y]) {
          this.data[x][y].selected = false;
        }
      }
    }
  }

  deselectRow(x: number, sy: number, ey: number): void {
    this.deselect(x, sy, x, ey);
  }

  deselectCol(y: number, sx: number, ex: number): void {
    this.deselect(sx, y, ex, y);
  }
}

export default Array2DTracer;
