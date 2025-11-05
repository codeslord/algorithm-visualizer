'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Button, Badge, Divider } from './ui';
import { useCurrentStore } from '@/store';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Dynamically import Ace editor to avoid SSR issues
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace');
    await import('ace-builds/src-noconflict/mode-javascript');
    await import('ace-builds/src-noconflict/mode-java');
    await import('ace-builds/src-noconflict/mode-c_cpp');
    await import('ace-builds/src-noconflict/mode-python');
    await import('ace-builds/src-noconflict/theme-monokai');
    await import('ace-builds/src-noconflict/ext-language_tools');
    return ace;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="spinner w-8 h-8" />
      </div>
    ),
  }
);

interface CodeEditorProps {
  onBuild?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ onBuild }) => {
  const { files, editingFile, updateFileContent, setShouldBuild, saved, setSaved } =
    useCurrentStore();
  const [activeTab, setActiveTab] = useState(0);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editingFile && files.length > 0) {
      const index = files.findIndex((f) => f.name === editingFile.name);
      if (index !== -1) setActiveTab(index);
    }
  }, [editingFile, files]);

  const handleChange = (value: string) => {
    const file = files[activeTab];
    if (file) {
      updateFileContent(file.name, value);
    }
  };

  const handleSave = () => {
    setSaved(true);
    // Implement save logic here
  };

  const getLanguageMode = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'h':
        return 'c_cpp';
      case 'py':
        return 'python';
      default:
        return 'javascript';
    }
  };

  if (files.length === 0) {
    return (
      <div className="glass-container h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-lg">No files to edit</p>
          <p className="text-sm mt-2">Select an algorithm from the navigator</p>
        </div>
      </div>
    );
  }

  const currentFile = files[activeTab];

  return (
    <div className="glass-container h-full flex flex-col">
      {/* Tabs */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10 overflow-x-auto glass-scrollbar">
        {files.map((file, index) => (
          <motion.button
            key={file.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setActiveTab(index)}
            className={cn(
              'tab-button flex items-center gap-2 px-4 py-2 whitespace-nowrap',
              activeTab === index && 'tab-button-active'
            )}
          >
            <span className="text-sm">{file.name}</span>
            {!saved && activeTab === index && (
              <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            )}
          </motion.button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Badge variant="primary">{getLanguageMode(currentFile.name)}</Badge>
          {currentFile.contributors && currentFile.contributors.length > 0 && (
            <div className="flex items-center gap-2">
              <Divider orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                {currentFile.contributors.map((contributor, i) => (
                  <Badge key={i} variant="default">
                    {contributor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!saved && (
            <Button variant="accent" size="sm" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onBuild}>
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            Build & Run
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <AceEditor
          mode={getLanguageMode(currentFile.name)}
          theme="monokai"
          value={currentFile.content}
          onChange={handleChange}
          name="code-editor"
          width="100%"
          height="100%"
          fontSize={14}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false,
          }}
          editorProps={{ $blockScrolling: true }}
          onLoad={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
