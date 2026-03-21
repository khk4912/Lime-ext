import { defineConfig } from 'wxt'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  srcDir: 'src',
  outDir: 'dist',
  zip: {
    artifactTemplate: 'Lime-v{{version}}-{{browser}}.zip',
    exclude: ['.DS_Store']
  },
  manifest: {
    name: 'Lime - 씨미 도우미',
    description: '씨미(Cime)에 다양한 기능을 추가합니다.',
    action: {
      default_title: 'Lime - 씨미 도우미',
    },
    permissions: ['storage'],
    web_accessible_resources: [
      {
        resources: ['src/*', 'pages/*', 'assets/*', '*.html'],
        matches: ['<all_urls>']
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
    },
    browser_specific_settings: {
      gecko: {
        id: 'lime_ext@kosame.dev'
      }
    }
  },

  vite: () =>
    ({
      define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@/entrypoints': path.resolve(__dirname, 'src/entrypoints'),
          '@/components': path.resolve(__dirname, 'src/components'),
          '@/hooks': path.resolve(__dirname, 'src/hooks'),
          '@/utils': path.resolve(__dirname, 'src/utils'),
          '@/types': path.resolve(__dirname, 'src/types'),
          '@/assets': path.resolve(__dirname, 'src/assets'),
        }
      },
      plugins: [svgr(), tailwindcss()],
      css: {
        modules: {
          localsConvention: 'camelCase',
        }
      },
    }),
})
