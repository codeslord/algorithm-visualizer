/**
 * Web Worker for executing algorithm code and capturing visualization commands
 */

// Import the tracer library
importScripts('/algorithm-visualizer.js');

// Override console methods to capture output
const originalConsole = {};
['log', 'error', 'warn', 'info'].forEach(method => {
  originalConsole[method] = console[method];
  console[method] = function(...args) {
    // Optionally log to original console for debugging
    // originalConsole[method](...args);
  };
});

// Override require to provide 'algorithm-visualizer' module
const require = (moduleName) => {
  if (moduleName === 'algorithm-visualizer') {
    return {
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
    };
  }
  throw new Error(`Module not found: ${moduleName}`);
};

// Listen for messages from the main thread
self.onmessage = function(e) {
  const { code } = e.data;

  try {
    // Reset commands from previous execution
    if (typeof __reset === 'function') {
      __reset();
    }

    // Execute the algorithm code
    eval(code);

    // Get all recorded commands
    const commands = __getCommands ? __getCommands() : [];

    // Group commands by chunk index
    const chunks = [];
    commands.forEach(command => {
      const chunkIdx = command.chunkIndex || 0;
      if (!chunks[chunkIdx]) {
        chunks[chunkIdx] = {
          lineNumber: command.lineNumber,
          commands: [],
        };
      }
      chunks[chunkIdx].commands.push({
        key: command.key,
        method: command.method,
        args: command.args,
        className: command.className, // Include className for tracer type identification
      });
    });

    // Send the chunks back to the main thread
    self.postMessage({
      success: true,
      chunks: chunks.filter(Boolean), // Remove empty slots
    });
  } catch (error) {
    // Send error back to the main thread
    self.postMessage({
      success: false,
      error: {
        message: error.message,
        stack: error.stack,
        line: error.lineNumber,
      },
    });
  }
};
