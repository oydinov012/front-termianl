import React from 'react';
import { Box, Typography } from '@mui/material';

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
}

interface TerminalConsoleProps {
  history: CommandHistory[];
  currentDirectory: string;
  command: string;
  setCommand: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>; // 👈 To'g'ri HTMLInputElement turi
  terminalEndRef: React.RefObject<HTMLDivElement | null>;
  availableSuggestions?: string[];
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  history,
  currentDirectory,
  command,
  setCommand,
  loading,
  onSubmit,
  inputRef,
  terminalEndRef,
  availableSuggestions = ['help', 'clear', 'check', 'ls', 'cd', 'mkdir', 'touch', 'nano', 'cat', 'rm']
}) => {

  // Tab bosilganda avto-to'ldirish (Autocomplete)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const words = command.split(' ');
      const lastWord = words[words.length - 1].toLowerCase();
      if (!lastWord) return;

      const match = availableSuggestions.find(s => s.toLowerCase().startsWith(lastWord));
      if (match) {
        words[words.length - 1] = match;
        setCommand(words.join(' '));
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      {/* Tizim xabari */}
      <Typography sx={{ color: '#555', fontSize: '0.8rem', fontFamily: 'monospace', mb: 1, lineHeight: 1.3 }}>
        Welcome to Cloud Terminal v1.0.4. Type 'help' for layout commands. Enter 'check' to verify task.
        <br />═══════════════════════════════════════════════════════
      </Typography>

      {/* Buyruqlar Tarixi */}
      {history.map((item, index) => (
        <Box key={index} sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold' }}>
              user@sandbox:{currentDirectory}$
            </Typography>
            <Typography sx={{ color: '#FFF', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              {item.command}
            </Typography>
          </Box>
          {/* 🔥 MANA SHU YERDA: Backenddan kelgan toza 'salom' chiqadi */}
          <Typography sx={{ color: '#A9FF99', whiteSpace: 'pre-wrap', pl: 2, mt: 0.2, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.4 }}>
            {item.output}
          </Typography>
        </Box>
      ))}

      {/* Yuklanish indikatori */}
      {loading && (
        <Typography sx={{ color: '#FFD700', fontFamily: 'monospace', fontSize: '0.85rem', mt: 1, mb: 1 }}>
          Bajarilmoqda...
        </Typography>
      )}

      {/* 🚀 JORIY INPUT CHIZIG'I (Tarixning oxirida doimiy turadi) */}
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: 0.5 }}>
        <form onSubmit={onSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography sx={{ color: '#39FF14', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 'bold', mr: 1, whiteSpace: 'nowrap' }}>
            user@sandbox:{currentDirectory}$
          </Typography>
          <input
            ref={inputRef} // 👈 Dashboarddan kelgan toza inputRef
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Buyruqni kiriting (Tab avto-to'ldirish)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#39FF14',
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              fontSize: '0.85rem',
            }}
          />
        </form>
      </Box>

      {/* Avto-scroll uchun ref */}
      <div ref={terminalEndRef} style={{ float: "left", clear: "both" }} />
    </Box>
  );
};

export default TerminalConsole;