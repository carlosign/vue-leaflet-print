// packages/core/release.config.cjs
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',               // analiza tus Conventional Commits
    '@semantic-release/release-notes-generator',       // genera notas de reléase
    '@semantic-release/changelog',                     // actualiza CHANGELOG.md
    [
      '@semantic-release/npm',
      {
        npmPublish: true,      // publica desde la raíz de core
        tarballDir: '.',       // opcional: guarda el tarball localmente
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'package.json'
        ],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    '@semantic-release/github'                         // crea la Release en GitHub
  ]
};