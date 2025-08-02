#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Next.js development server...');

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

const child = spawn(nextBin, ['dev', '--port', '3000'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    NODE_OPTIONS: '--max-old-space-size=2048',
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

child.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  if (signal) {
    console.log(`⚠️  Development server was killed with signal ${signal}`);
  } else {
    console.log(`📄 Development server exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('🛑 Stopping development server...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Terminating development server...');
  child.kill('SIGTERM');
});
