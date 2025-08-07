module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        // Publica desde la carpeta de build
        pkgRoot: 'dist',
        npmPublish: true

      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'dist/package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    '@semantic-release/github'
  ]
};
