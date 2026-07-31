import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        letters: resolve(__dirname, 'letters.html'),
        garden: resolve(__dirname, 'garden.html'),
        music: resolve(__dirname, 'music.html'),
        album: resolve(__dirname, 'album.html'),
        wishes: resolve(__dirname, 'wishes.html'),
        surprise: resolve(__dirname, 'surprise.html'),
      },
    },
  },
});
