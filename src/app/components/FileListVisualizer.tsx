import React from 'react';
import { Box, Typography } from '@mui/material';
import { Folder, File } from 'lucide-react';

interface FileListVisualizerProps {
  structure: string[] | Record<string, any> | null;
}

export const FileListVisualizer: React.FC<FileListVisualizerProps> = ({ structure }) => {
  if (!structure || (Array.isArray(structure) && structure.length === 0)) {
    return (
      <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic', textAlign: 'center', mt: 4, fontFamily: 'monospace' }}>
        Papka bo'sh. Terminalda buyruqlar yordamida fayl yarating...
      </Typography>
    );
  }

  if (Array.isArray(structure)) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {structure.map((item, idx) => {
          const isFolder = !item.includes('.') && !item.includes('_txt') && !item.includes('_png');
          return (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.2, pl: 1 }}>
              {isFolder ? (
                <Folder size={16} style={{ color: '#FFD700', fill: '#FFD700', opacity: 0.8 }} />
              ) : (
                <File size={16} style={{ color: '#A0A0A0' }} />
              )}
              <Typography variant="body2" sx={{ color: '#E0E0E0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
                {item}{isFolder ? '/' : ''}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  const renderNestedTree = (data: any, name?: string) => {
    if (typeof data === 'string') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 2, py: 0.2 }}>
          <File size={14} style={{ color: '#A0A0A0' }} />
          <Typography variant="body2" sx={{ color: '#E0E0E0', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>{data}</Typography>
        </Box>
      );
    }
    if (Array.isArray(data)) {
      return <>{data.map((item, idx) => <Box key={idx}>{renderNestedTree(item)}</Box>)}</>;
    }
    return (
      <Box sx={{ pl: name ? 2 : 0 }}>
        {name && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.4 }}>
            <Folder size={16} style={{ color: '#FFD700', fill: '#FFD700', opacity: 0.8 }} />
            <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
              {name}/
            </Typography>
          </Box>
        )}
        <Box sx={{ borderLeft: name ? '1px dashed rgba(255,255,255,0.15)' : 'none', ml: name ? 1 : 0 }}>
          {Object.keys(data).map((key) => (
            <Box key={key}>{renderNestedTree(data[key], key)}</Box>
          ))}
        </Box>
      </Box>
    );
  };

  return <Box>{renderNestedTree(structure)}</Box>;
};

export default FileListVisualizer;