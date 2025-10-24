#!/usr/bin/env node

/**
 * Build script for Chalamandra QuantumMind
 * Chrome AI Hackathon 2025
 */

const fs = require('fs');
const path = require('path');

console.log('🦎 Building Chalamandra QuantumMind...');

// Create build directory
const buildDir = './build';
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Files to copy
const filesToCopy = [
  'manifest.json',
  'README.md',
  'LICENSE',
  'package.json'
];

const directoriesToCopy = [
  'popup',
  'content',
  'background',
  'icons',
  'docs'
];

// Copy files
filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(buildDir, file));
    console.log(`✅ Copied ${file}`);
  }
});

// Copy directories
directoriesToCopy.forEach(dir => {
  if (fs.existsSync(dir)) {
    copyDirSync(dir, path.join(buildDir, dir));
    console.log(`✅ Copied ${dir}/`);
  }
});

console.log('🎉 Build completed successfully!');
console.log(`📁 Build location: ${buildDir}`);

// Utility function to copy directories
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
  }
