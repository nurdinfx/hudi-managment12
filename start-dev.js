#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Next.js development server...');

const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
console.log(`📁 Using Next.js binary: ${nextBin}`);
console.log(`⚙️  Environment: NODE_ENV=development, NODE_OPTIONS=--max-old-space-size=2048`);

const child = spawn(nextBin, ['dev', '--port', '3000'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: {
    ...process.env,
    NODE_ENV: 'development',
    NODE_OPTIONS: '--max-old-space-size=2048',
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

// Pipe output with prefixes
child.stdout.on('data', (data) => {
  process.stdout.write(`[NEXT] ${data}`);
});

child.stderr.on('data', (data) => {
  process.stderr.write(`[NEXT-ERR] ${data}`);
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
