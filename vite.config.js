import { defineConfig } from 'vite';
import path from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

export default defineConfig({
  plugins: [ 
    eslintPlugin({
      // Опции: можно указать, включать ли предупреждения, кэш и т.д.
      cache: false,
      include: ['**/*.js'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
    createSvgIconsPlugin({
      iconDirs: ['src/assets/icons'],
      failOnError: true,
      // Оптимизация SVG с помощью SVGO (настройка под ваш стиль)
      svgoOptions: {
        multipass: true, // многопроходная оптимизация
      }
    }),
  ],
});