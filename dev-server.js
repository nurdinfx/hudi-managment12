#!/usr/bin/env node

const { spawn } = require('child_process');

// Set memory allocation
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

console.log('Starting development server with increased memory allocation...');
console.log('Memory limit: 4GB');

const child = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--max-old-space-size=4096',
    NEXT_TELEMETRY_DISABLED: '1'
  },
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start development server:', error);
  process.exit(1);
});

child.on('close', (code) => {
  console.log(`Development server exited with code ${code}`);
  process.exit(code);
});
