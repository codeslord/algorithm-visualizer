import React from 'react';

export type GetObjectFunction = (key: string) => any;

export class Tracer {
  key: string;
  getObject: GetObjectFunction;
  title: string;

  constructor(key: string, getObject: GetObjectFunction, title: string) {
    this.key = key;
    this.getObject = getObject;
    this.title = title;
    this.init();
    this.reset();
  }

  getRendererClass(): React.ComponentType<any> {
    return () => <div>Base Renderer</div>;
  }

  init(): void {}

  render(): React.ReactElement {
    const RendererClass = this.getRendererClass();
    return <RendererClass key={this.key} title={this.title} data={this} />;
  }

  set(...args: any[]): void {}

  reset(): void {
    this.set();
  }
}

export default Tracer;
