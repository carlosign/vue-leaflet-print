// packages/core/scripts/prepare-publish.cjs
import { copyFileSync, writeFileSync } from 'fs';
import path from 'path';
import pkg from '../package.json';

// 1) Prepara un package.json limpio para dist
const { name, version, description, main, module, types, dependencies, peerDependencies, author, license, repository, keywords } = pkg;
const distPkg = { 
  name, version, description, main, module, types,
  dependencies, peerDependencies,
  author, license, repository, keywords
};
// Escribe dist/package.json
writeFileSync(
  path.resolve(__dirname, '../dist/package.json'),
  JSON.stringify(distPkg, null, 2)
);

// 2) Copia README y LICENSE
['README.MD', 'LICENSE'].forEach(file =>
  copyFileSync(
    path.resolve(__dirname, '..', file),
    path.resolve(__dirname, '../dist', file)
  )
);
