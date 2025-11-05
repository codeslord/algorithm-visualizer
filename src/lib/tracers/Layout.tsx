import React from 'react';
import { Tracer } from './Tracer';

export class Layout {
  tracers: Tracer[];
  key: string;

  constructor(tracers: Tracer[]) {
    this.tracers = tracers;
    this.key = 'layout';
  }

  render(): React.ReactElement {
    return (
      <div className="flex flex-col gap-4">
        {this.tracers.map(tracer => (
          <div key={tracer.key}>{tracer.render()}</div>
        ))}
      </div>
    );
  }
}

export class VerticalLayout extends Layout {
  constructor(tracers: Tracer[]) {
    super(tracers);
    this.key = 'vertical_layout';
  }

  render(): React.ReactElement {
    return (
      <div className="flex flex-col gap-4">
        {this.tracers.map(tracer => (
          <div key={tracer.key}>{tracer.render()}</div>
        ))}
      </div>
    );
  }
}

export class HorizontalLayout extends Layout {
  constructor(tracers: Tracer[]) {
    super(tracers);
    this.key = 'horizontal_layout';
  }

  render(): React.ReactElement {
    return (
      <div className="flex flex-row gap-4">
        {this.tracers.map(tracer => (
          <div key={tracer.key} className="flex-1">
            {tracer.render()}
          </div>
        ))}
      </div>
    );
  }
}
