// File and Algorithm Types
export interface FileContent {
  name: string;
  content: string;
  contributors?: string[];
}

export interface Algorithm {
  categoryKey: string;
  algorithmKey: string;
}

export interface ScratchPaper {
  login: string;
  gistId: string;
}

export interface Category {
  key: string;
  name: string;
  algorithms: AlgorithmInfo[];
}

export interface AlgorithmInfo {
  key: string;
  name: string;
  description?: string;
}

// Player Types
export interface Command {
  key: string;
  method: string;
  args: any[];
}

export interface Chunk {
  commands: Command[];
  lineNumber?: number;
}

export interface LineIndicator {
  lineNumber?: number;
  cursor: number;
}

// User Types
export interface User {
  login: string;
  avatar_url: string;
}

// Tracer Types
export interface TracerData {
  type: string;
  data: any;
}
