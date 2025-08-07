module.exports = {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        config: require.resolve('./scripts/changelog-config.cjs'),
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      { pkgRoot: 'dist', npmPublish: true }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'dist/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
