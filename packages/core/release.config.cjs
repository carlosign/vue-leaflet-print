// packages/core/release.config.cjs
const coerceIso = (v) => {
  const d = v ? new Date(v) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toISOString() : new Date().toISOString();
};

module.exports = {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          transform(commit) {
            // Normaliza fechas chotas de cualquier origen
            const candidates = [
              commit.committerDate,
              commit.authorDate,
              commit.commit && commit.commit.committerDate,
              commit.commit && commit.commit.authorDate,
            ];
            commit.committerDate = coerceIso(candidates.find(Boolean));
            commit.authorDate = coerceIso(commit.authorDate);
            return commit;
          },
        },
      },
    ],
    '@semantic-release/changelog',
    ['@semantic-release/npm', { pkgRoot: 'dist', npmPublish: true }],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'dist/package.json'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
