import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { SITE_URL, pages } from './src/shared/pageMeta.js'

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function tag(attribute, name, content) {
  return `<meta ${attribute}="${escapeAttribute(name)}" content="${escapeAttribute(content)}" />`
}

function headFor(page) {
  const url = `${SITE_URL}${page.route}`
  const image = `${SITE_URL}${page.image}`
  const head = []

  if (page.background) {
    // In the markup rather than left to the router, so the colour is already
    // there on the first paint instead of arriving once the app boots.
    head.push(
      `<style>html{background-color:${escapeAttribute(page.background)}}</style>`,
      // Tints the browser's own chrome to match. On iOS that includes the bar
      // along the bottom of the window, which is otherwise white.
      tag('name', 'theme-color', page.background),
    )
  }

  return head.concat([
    tag('name', 'description', page.description),
    `<link rel="canonical" href="${escapeAttribute(url)}" />`,
    tag('property', 'og:type', 'website'),
    tag('property', 'og:site_name', 'jetysalina.com'),
    tag('property', 'og:url', url),
    tag('property', 'og:title', page.title),
    tag('property', 'og:description', page.description),
    tag('property', 'og:image', image),
    tag('property', 'og:image:secure_url', image),
    tag('property', 'og:image:type', page.imageType),
    tag('property', 'og:image:width', page.imageWidth),
    tag('property', 'og:image:height', page.imageHeight),
    tag('property', 'og:image:alt', page.imageAlt),
    // X reads og:* for everything but the card shape, which it needs told.
    tag('name', 'twitter:card', 'summary_large_image'),
    tag('name', 'twitter:title', page.title),
    tag('name', 'twitter:description', page.description),
    tag('name', 'twitter:image', image),
    tag('name', 'twitter:image:alt', page.imageAlt),
  ]).join('\n    ')
}

// Writes one HTML file per page in pageMeta.js, each a copy of the built
// index.html carrying that page's preview tags. The bundle's asset paths are
// absolute, so a copy in a subdirectory boots the same app; the router then
// reads the URL and shows the right page, exactly as it does on a deep link.
function routeMeta() {
  return {
    name: 'route-meta',
    apply: 'build',
    enforce: 'post',
    generateBundle(options, bundle) {
      const index = bundle['index.html']
      if (!index) {
        this.warn('no index.html in the bundle - no preview pages written')
        return
      }

      // Snapshotted before the loop: the root page is written by editing this
      // very asset, and every other page is a copy of the untouched original.
      // Reading it fresh each time would stack the root page's tags onto them.
      const baseHtml = index.source

      for (const page of pages) {
        let html = baseHtml
          .replace('<title></title>', `<title>${escapeAttribute(page.title)}</title>`)
          .replace('href=""', `href="${escapeAttribute(page.favicon)}"`)
          .replace('</head>', `  ${headFor(page)}
  </head>`)

        // Set on the element rather than in a stylesheet, because the router
        // drives this same property once the app is running. A rule in a
        // <style> block would survive a move to another page and leave this
        // page's colour behind on the next one.
        if (page.background) {
          html = html.replace(
            '<body>',
            `<body style="background-color: ${escapeAttribute(page.background)}">`,
          )
        }

        if (html === baseHtml) {
          this.error(`index.html did not contain the markers ${page.route} needs`)
        }

        // The root page has no path of its own to be written to - it is the
        // index.html the host already serves, and the file every unknown path
        // falls back to. So it is edited in place rather than copied.
        if (page.route === '/') {
          index.source = html
          continue
        }

        // Two spellings of the same page, because hosts disagree about how
        // they resolve an extensionless path. Netlify and Vercel look for
        // `<path>.html` first; GitHub Pages and Cloudflare serve the directory
        // index. Whichever one is checked, a real file is found there and
        // wins over the SPA catch-all that would otherwise return the bare
        // index.html with no preview tags on it.
        const name = page.route.replace(/^\//, '')
        for (const fileName of [`${name}.html`, `${name}/index.html`]) {
          this.emitFile({ type: 'asset', fileName, source: html })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), routeMeta()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
