#!/usr/bin/env node

import { execSync } from 'child_process';

// Run vite build - TanStack React Start will handle HTML generation
console.log('Building with TanStack React Start...');
execSync('vite build', { stdio: 'inherit' });
console.log('✓ Build completed successfully');
