import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

// Automatically check and copy pk.jpg if it exists in root or assets
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

if (fs.existsSync('src/assets/images/pk_1781196830363.jpg')) {
  try {
    fs.copyFileSync('src/assets/images/pk_1781196830363.jpg', 'public/pk.jpg');
    console.info('Successfully copied custom asset image to public/pk.jpg');
  } catch (err) {
    console.error('Failed to copy custom asset image:', err);
  }
} else if (fs.existsSync('pk.jpg')) {
  try {
    fs.copyFileSync('pk.jpg', 'public/pk.jpg');
    console.info('Successfully integrated pk.jpg into public static directory.');
  } catch (err) {
    console.error('Failed to copy pk.jpg to public static directory:', err);
  }
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
