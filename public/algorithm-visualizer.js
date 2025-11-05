/**
 * Tracer Library for Algorithm Visualizer
 * This library is injected into the Web Worker to capture visualization commands
 */

// Global command queue
const commands = [];
let chunkIndex = 0;
let lineNumber = null;

// Base Tracer class
class Tracer {
  constructor(name = 'Tracer') {
    this.key = name.toLowerCase().replace(/\s+/g, '_');
    this.className = this.constructor.name;
  }

  _command(method, ...args) {
    commands.push({
      key: this.key,
      method,
      args: args.map(arg => {
        // Convert to serializable format
        if (Array.isArray(arg)) return [...arg];
        if (typeof arg === 'object' && arg !== null) return { ...arg };
        return arg;
      }),
      lineNumber,
      chunkIndex,
    });
  }

  static delay() {
    chunkIndex++;
  }

  static setRoot(layout) {
    commands.push({
      key: null,
      method: 'setRoot',
      args: [layout.key],
      chunkIndex,
    });
  }
}

// Array1DTracer - for visualizing 1D arrays
class Array1DTracer extends Tracer {
  constructor(name = 'Array1DTracer') {
    super(name);
    this._command('construct', name);
  }

  set(array) {
    this._command('set', array);
    return this;
  }

  patch(index, value) {
    this._command('patch', index, value);
    return this;
  }

  depatch(index) {
    this._command('depatch', index);
    return this;
  }

  select(index, ...indices) {
    this._command('select', index, ...indices);
    return this;
  }

  deselect(index, ...indices) {
    this._command('deselect', index, ...indices);
    return this;
  }

  chart(chartTracer) {
    this.chartKey = chartTracer.key;
    this._command('chart', chartTracer.key);
    return this;
  }
}

// Array2DTracer - for visualizing 2D arrays/matrices
class Array2DTracer extends Tracer {
  constructor(name = 'Array2DTracer') {
    super(name);
    this._command('construct', name);
  }

  set(array2d) {
    this._command('set', array2d);
    return this;
  }

  patch(row, col, value) {
    this._command('patch', row, col, value);
    return this;
  }

  depatch(row, col) {
    this._command('depatch', row, col);
    return this;
  }

  select(row, col) {
    this._command('select', row, col);
    return this;
  }

  deselect(row, col) {
    this._command('deselect', row, col);
    return this;
  }
}

// LogTracer - for logging messages
class LogTracer extends Tracer {
  constructor(name = 'LogTracer') {
    super(name);
    this._command('construct', name);
  }

  print(message) {
    this._command('print', String(message));
    return this;
  }

  println(message) {
    this._command('println', String(message));
    return this;
  }

  printf(format, ...args) {
    const message = format.replace(/%([sd])/g, (match, type) => {
      const arg = args.shift();
      return type === 's' ? String(arg) : Number(arg);
    });
    this._command('print', message);
    return this;
  }
}

// ChartTracer - for visualizing bar charts
class ChartTracer extends Tracer {
  constructor(name = 'ChartTracer') {
    super(name);
    this._command('construct', name);
  }

  set(array) {
    this._command('set', array);
    return this;
  }

  patch(index, value) {
    this._command('patch', index, value);
    return this;
  }

  select(index) {
    this._command('select', index);
    return this;
  }

  deselect(index) {
    this._command('deselect', index);
    return this;
  }
}

// GraphTracer - for visualizing graphs
class GraphTracer extends Tracer {
  constructor(name = 'GraphTracer') {
    super(name);
    this._command('construct', name);
  }

  set(nodes) {
    this._command('set', nodes);
    return this;
  }

  addNode(id, weight = 0, visitedCount = 0, selectedCount = 0) {
    this._command('addNode', id, weight, visitedCount, selectedCount);
    return this;
  }

  updateNode(id, weight, visitedCount, selectedCount) {
    this._command('updateNode', id, weight, visitedCount, selectedCount);
    return this;
  }

  removeNode(id) {
    this._command('removeNode', id);
    return this;
  }

  addEdge(source, target, weight = 0, visitedCount = 0, selectedCount = 0) {
    this._command('addEdge', source, target, weight, visitedCount, selectedCount);
    return this;
  }

  updateEdge(source, target, weight, visitedCount, selectedCount) {
    this._command('updateEdge', source, target, weight, visitedCount, selectedCount);
    return this;
  }

  removeEdge(source, target) {
    this._command('removeEdge', source, target);
    return this;
  }

  visit(target, source, weight) {
    this._command('visit', target, source, weight);
    return this;
  }

  leave(target, source, weight) {
    this._command('leave', target, source, weight);
    return this;
  }

  select(target, source) {
    this._command('select', target, source);
    return this;
  }

  deselect(target, source) {
    this._command('deselect', target, source);
    return this;
  }

  log(key) {
    this._command('log', key);
    return this;
  }

  directed(isDirected = true) {
    this._command('directed', isDirected);
    return this;
  }

  weighted(isWeighted = true) {
    this._command('weighted', isWeighted);
    return this;
  }

  layoutTree(root = 0, sorted = false) {
    this._command('layoutTree', root, sorted);
    return this;
  }

  layoutCircle() {
    this._command('layoutCircle');
    return this;
  }

  layoutRandom() {
    this._command('layoutRandom');
    return this;
  }
}

// MarkdownTracer - for displaying markdown
class MarkdownTracer extends Tracer {
  constructor(name = 'MarkdownTracer') {
    super(name);
    this._command('construct', name);
  }

  set(markdown) {
    this._command('set', markdown);
    return this;
  }
}

// ScatterTracer - for scatter plots
class ScatterTracer extends Tracer {
  constructor(name = 'ScatterTracer') {
    super(name);
    this._command('construct', name);
  }

  set(array) {
    this._command('set', array);
    return this;
  }

  patch(index, x, y) {
    this._command('patch', index, x, y);
    return this;
  }

  select(index) {
    this._command('select', index);
    return this;
  }

  deselect(index) {
    this._command('deselect', index);
    return this;
  }
}

// Layout classes
class Layout {
  constructor(tracers) {
    this.tracers = tracers;
    this.key = 'layout';
  }

  static setRoot(layout) {
    Tracer.setRoot(layout);
  }
}

class VerticalLayout extends Layout {
  constructor(tracers) {
    super(tracers);
    this.key = 'vertical_layout';
  }
}

class HorizontalLayout extends Layout {
  constructor(tracers) {
    super(tracers);
    this.key = 'horizontal_layout';
  }
}

// Randomize utility
class Randomize {
  static Integer(options) {
    const { min = 0, max = 100 } = options || {};
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static Array1D(options) {
    const { N = 10, min = 0, max = 100 } = options || {};
    const array = [];
    for (let i = 0; i < N; i++) {
      array.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return array;
  }

  static Array2D(options) {
    const { N = 5, M = 5, min = 0, max = 100 } = options || {};
    const array = [];
    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < M; j++) {
        row.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
      array.push(row);
    }
    return array;
  }

  static Graph(options) {
    const { N = 5, ratio = 0.3, directed = false, weighted = false } = options || {};
    // Create adjacency matrix
    const graph = [];
    for (let i = 0; i < N; i++) {
      const row = [];
      for (let j = 0; j < N; j++) {
        row.push(0);
      }
      graph.push(row);
    }

    // Add edges based on ratio
    for (let i = 0; i < N; i++) {
      for (let j = directed ? 0 : i + 1; j < N; j++) {
        if (i !== j && Math.random() < ratio) {
          const weight = weighted ? Math.floor(Math.random() * 100) + 1 : 1;
          graph[i][j] = weight;
          if (!directed) {
            graph[j][i] = weight; // Undirected graph
          }
        }
      }
    }

    return graph;
  }
}

// Export as algorithm-visualizer module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Tracer,
    Array1DTracer,
    Array2DTracer,
    LogTracer,
    ChartTracer,
    GraphTracer,
    MarkdownTracer,
    ScatterTracer,
    Layout,
    VerticalLayout,
    HorizontalLayout,
    Randomize,
    __getCommands: () => commands,
    __reset: () => {
      commands.length = 0;
      chunkIndex = 0;
      lineNumber = null;
    },
  };
}

// Also expose in global scope for Web Worker usage
if (typeof self !== 'undefined') {
  self.Tracer = Tracer;
  self.Array1DTracer = Array1DTracer;
  self.Array2DTracer = Array2DTracer;
  self.LogTracer = LogTracer;
  self.ChartTracer = ChartTracer;
  self.GraphTracer = GraphTracer;
  self.MarkdownTracer = MarkdownTracer;
  self.ScatterTracer = ScatterTracer;
  self.Layout = Layout;
  self.VerticalLayout = VerticalLayout;
  self.HorizontalLayout = HorizontalLayout;
  self.Randomize = Randomize;
  self.__getCommands = () => commands;
  self.__reset = () => {
    commands.length = 0;
    chunkIndex = 0;
    lineNumber = null;
  };
}
