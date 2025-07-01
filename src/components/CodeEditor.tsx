import React, { useState, useEffect } from 'react';
import { Save, Copy, Download, Settings, Search, Replace } from 'lucide-react';

interface CodeEditorProps {
  currentFile: any;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ currentFile }) => {
  const [code, setCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    // Load file content based on file type
    if (currentFile) {
      const sampleContent = getSampleContent(currentFile);
      setCode(sampleContent);
    }
  }, [currentFile]);

  const getSampleContent = (file: any) => {
    if (file.type === 'javascript') {
      if (file.name === 'main.js') {
        return `// Main application entry point
import { Engine } from './engine';
import { Player } from './Player';

class Game {
  constructor() {
    this.engine = new Engine();
    this.player = new Player();
    this.init();
  }

  init() {
    console.log('Game initialized');
    this.engine.start();
  }

  update() {
    this.player.update();
  }
}

const game = new Game();
export default game;`;
      } else if (file.name === 'Player.js') {
        return `// Player class for game character
export class Player {
  constructor() {
    this.position = { x: 0, y: 0, z: 0 };
    this.health = 100;
    this.speed = 5;
  }

  update() {
    // Update player logic
    this.handleInput();
    this.updatePosition();
  }

  handleInput() {
    // Handle player input
  }

  updatePosition() {
    // Update player position
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    console.log('Player died');
  }
}`;
      } else if (file.isPlugin) {
        return `// Plugin: ${file.name}
// Auto-generated plugin file

export class ${file.name.replace('.js', '')} {
  constructor() {
    this.name = '${file.name.replace('.js', '')}';
    this.version = '1.0.0';
    this.enabled = true;
  }

  init() {
    console.log(\`Plugin \${this.name} initialized\`);
  }

  execute() {
    // Plugin functionality here
  }

  destroy() {
    console.log(\`Plugin \${this.name} destroyed\`);
  }
}`;
      }
      return `// ${file.name}
// Add your code here

console.log('Hello from ${file.name}');`;
    } else if (file.type === 'css') {
      return `/* Styles for ${file.name} */

body {
  margin: 0;
  padding: 0;
  font-family: 'Arial', sans-serif;
  background-color: #1a1a1a;
  color: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  background-color: #2a2a2a;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}`;
    } else if (file.type === 'json') {
      return `{
  "name": "${currentFile?.name || 'config'}",
  "version": "1.0.0",
  "description": "Configuration file",
  "settings": {
    "debug": true,
    "maxPlayers": 10,
    "gameMode": "survival"
  },
  "graphics": {
    "resolution": "1920x1080",
    "fullscreen": false,
    "vsync": true
  }
}`;
    }
    return '// New file\n// Start coding here...';
  };

  const handleSave = () => {
    console.log('Saving file:', currentFile?.name);
    // Implement save functionality
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const getLanguageFromFile = (file: any) => {
    if (file?.type === 'javascript') return 'javascript';
    if (file?.type === 'css') return 'css';
    if (file?.type === 'json') return 'json';
    return 'text';
  };

  if (!currentFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">No File Selected</h3>
          <p>Select a file from the explorer to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      {/* Editor Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">{currentFile.name}</h3>
          <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">
            {getLanguageFromFile(currentFile)}
          </span>
          {currentFile.isPlugin && (
            <span className="text-xs bg-purple-600 px-2 py-1 rounded text-white">
              Plugin
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="p-2 hover:bg-gray-700 rounded transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search in file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
              />
            </div>
            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <Replace className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Code Editor */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none"
          style={{
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            lineHeight: '1.5',
            tabSize: 2
          }}
          placeholder="Start typing your code..."
          spellCheck={false}
        />
        
        {/* Line numbers overlay */}
        <div className="absolute left-0 top-0 p-4 pointer-events-none text-gray-500 font-mono text-sm select-none">
          {code.split('\n').map((_, index) => (
            <div key={index} style={{ lineHeight: '1.5' }}>
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-400">
            Lines: {code.split('\n').length}
          </span>
          <span className="text-gray-400">
            Characters: {code.length}
          </span>
        </div>
        <div className="text-gray-400">
          {getLanguageFromFile(currentFile).toUpperCase()}
        </div>
      </div>
    </div>
  );
};