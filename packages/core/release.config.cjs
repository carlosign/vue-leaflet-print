// packages/core/release.config.cjs
module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        // Puedes usar 'angular', 'conventionalcommits', etc.
        // El preset 'angular' es el más común:
        preset: 'angular',
        // Opcional: ajusta parserOpts si usas un formato distinto:
        parserOpts: {
          headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'subject'],
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
        }
      }
    ],
    [
  '@semantic-release/release-notes-generator',
  {
    // Usamos el mismo preset “angular” (o el que sigas en tus commits)
    preset: 'angular',
    // (Opcional) Repite parserOpts si tu convención de cabeceras difiere
    parserOpts: {
      headerPattern: /^(\w*)(?:\((.*)\))?!?: (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES']
    }
    // (Opcional) writerOpts para personalizar salida
    // writerOpts: { commitsSort: ['scope', 'subject'] }
  }
],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {

        npmPublish: true
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'dist/package.json', 'dist/README.MD', 'dist/LICENSE'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
