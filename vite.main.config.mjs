/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2025-08-08 11:08:02
 * @LastEditTime: 2025-08-08 17:00:02
 * @Description: 
 */
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['bufferutil', 'utf-8-validate', 'ws'],
    },
  },
});
