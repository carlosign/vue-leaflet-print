module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/changelog',
    // solo escribe la versión en dist, no publica
    ['@semantic-release/npm', { pkgRoot: 'dist', npmPublish: false }],
    // publica explícitamente desde dist
    ['@semantic-release/exec', { publishCmd: 'bash -lc "cd dist && npm publish --access public"' }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'dist/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
      }
    ],
    '@semantic-release/github'
  ]
}
