// packages/core/scripts/prepare-publish.cjs
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const root = process.cwd()
const pkgPath = path.join(root, 'package.json')
const distDir = path.join(root, 'dist')
const distPkgPath = path.join(distDir, 'package.json')

if (!fs.existsSync(distDir)) {
  console.error('dist/ no existe. Ejecutá el build antes de este paso.')
  process.exit(1)
}

const srcPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

// Campos a limpiar para el paquete publicado //
const {
  name,
  description,
  keywords,
  author,
  license,
  repository,
  bugs,
  homepage,
  // ignoramos version: semantic-release la setea
} = srcPkg

const out = {
  name,
  description,
  keywords,
  author,
  license,
  repository,
  bugs,
  homepage,
  version: '0.0.0-development',        // ← placeholder (semantic-release lo pisa)
  type: 'module',
  main: './index.umd.js',
  module: './index.es.js',
  types: './index.d.ts',
  exports: {
    '.': { import: './index.es.js', require: './index.umd.js' },
    './package.json': './package.json',
  },
  publishConfig: { access: 'public' },  // ← importante para scoped
  peerDependencies: srcPkg.peerDependencies || {},
  dependencies: srcPkg.dependencies || {},
  sideEffects: ['./style.css'],
}


// Escribimos package.json en dist
fs.writeFileSync(distPkgPath, JSON.stringify(out, null, 2))
console.log(`✔ Escrito ${path.relative(root, distPkgPath)}`)

// Copiamos README y LICENSE si existen
const maybeCopy = (file) => {
  const src = path.join(root, file)
  if (fs.existsSync(src)) {
    const dst = path.join(distDir, file)
    fs.copyFileSync(src, dst)
    console.log(`✔ Copiado ${file} → dist/${file}`)
  }
}
maybeCopy('README.md')
maybeCopy('README.MD') // por si acaso
maybeCopy('LICENSE')
