#!/usr/bin/env node
// packages/core/scripts/prepare-publish.cjs

const { copyFileSync, writeFileSync } = require('fs');
const path = require('path');
const pkg = require('../package.json');

// Extrae solo los campos que quieras publicar
const {
  name,
  version,
  description,
  main,
  module,
  types,
  dependencies,
  peerDependencies,
  author,
  license,
  repository,
  keywords
} = pkg;

const distPkg = {
  name,
  version,
  description,
  main,
  module,
  types,
  dependencies,
  peerDependencies,
  author,
  license,
  repository,
  keywords
};

// Asegúrate de que la carpeta dist exista antes de escribir ahí
const distDir = path.resolve(__dirname, '../dist');
if (!require('fs').existsSync(distDir)) {
  require('fs').mkdirSync(distDir, { recursive: true });
}

// 1) Escribe dist/package.json
writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(distPkg, null, 2)
);

// 2) Copia README y LICENSE
['README.MD', 'LICENSE'].forEach(file => {
  copyFileSync(
    path.resolve(__dirname, '..', file),
    path.join(distDir, file)
  );
});
