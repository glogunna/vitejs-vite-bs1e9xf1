import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Search } from 'lucide-react';

interface FileExplorerProps {
  onFileSelect: (file: any) => void;
  currentFile?: any;
  project: any;
  installedPlugins: any[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  onFileSelect, 
  currentFile, 
  project, 
  installedPlugins 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'assets']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Sample file structure based on project type
  const getFileStructure = () => {
    const baseStructure = [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        children: [
          { id: 'main', name: 'main.js', type: 'javascript' },
          { id: 'config', name: 'config.json', type: 'json' },
        ]
      },
      {
        id: 'assets',
        name: 'assets',
        type: 'folder',
        children: [
          { id: 'images', name: 'images', type: 'folder', children: [] },
          { id: 'sounds', name: 'sounds', type: 'folder', children: [] },
        ]
      }
    ];

    if (project?.type === 'game3d') {
      baseStructure[0].children.push(
        { id: 'player', name: 'Player.js', type: 'javascript' },
        { id: 'world', name: 'World.js', type: 'javascript' }
      );
    } else if (project?.type === 'game2d') {
      baseStructure[0].children.push(
        { id: 'sprite', name: 'Sprite.js', type: 'javascript' },
        { id: 'scene', name: 'Scene.js', type: 'javascript' }
      );
    } else if (project?.type === 'webapp') {
      baseStructure[0].children.push(
        { id: 'app', name: 'App.js', type: 'javascript' },
        { id: 'components', name: 'components', type: 'folder', children: [
          { id: 'header', name: 'Header.js', type: 'javascript' },
          { id: 'footer', name: 'Footer.js', type: 'javascript' }
        ]},
        { id: 'styles', name: 'styles.css', type: 'css' }
      );
    }

    return baseStructure;
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm ${
            currentFile?.id === item.id ? 'bg-green-600 text-white' : 'text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              onFileSelect(item);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              {expandedFolders.has(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              {expandedFolders.has(item.id) ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <File className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="truncate">{item.name}</span>
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div>
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const fileStructure = getFileStructure();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Explorer</h2>
        <button className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
        />
      </div>

      {/* Project Info */}
      <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
        <h3 className="font-semibold text-green-400 mb-1">{project?.name}</h3>
        <p className="text-xs text-gray-400 capitalize">{project?.type} Project</p>
      </div>

      {/* File Tree */}
      <div className="space-y-1">
        {renderFileTree(fileStructure)}
      </div>

      {/* Plugin Files */}
      {installedPlugins.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Plugin Files</h3>
          <div className="space-y-1">
            {installedPlugins.map((plugin) => (
              <div
                key={plugin.id}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
                onClick={() => onFileSelect({ 
                  id: `plugin-${plugin.id}`, 
                  name: `${plugin.name}.js`, 
                  type: 'javascript',
                  isPlugin: true 
                })}
              >
                <div className="w-4" />
                <File className="w-4 h-4 text-purple-400" />
                <span className="truncate">{plugin.name}.js</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};