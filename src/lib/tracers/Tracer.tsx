import React from 'react';

export interface TracerProps {
  title: string;
  data: any;
}

export class Tracer {
  key: string;
  title: string;
  getObject: (key: string) => Tracer;

  constructor(key: string, getObject: (key: string) => Tracer, title: string) {
    this.key = key;
    this.getObject = getObject;
    this.title = title;
    this.init();
    this.reset();
  }

  getRendererClass(): React.ComponentType<any> {
    // Base renderer - override in subclasses
    return () => null;
  }

  init() {
    // Override in subclasses
  }

  render(): React.ReactElement | null {
    const RendererClass = this.getRendererClass();
    return React.createElement(RendererClass, {
      key: this.key,
      title: this.title,
      data: this,
    });
  }

  set() {
    // Override in subclasses
  }

  reset() {
    this.set();
  }
}
