// packages/core/release.config.cjs
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        // Fix: si un commit no trae fecha válida, ponemos una ISO
        writerOpts: {
          transform: (commit) => {
            try {
              const d = commit && commit.committerDate ? new Date(commit.committerDate) : null
              if (!d || isNaN(d)) commit.committerDate = new Date().toISOString()
            } catch {
              commit.committerDate = new Date().toISOString()
            }
            return commit
          },
        },
      },
    ],
    '@semantic-release/changelog',
    // ⬇️ Publicamos el paquete DESDE dist
    ['@semantic-release/npm', { npmPublish: true, pkgRoot: 'dist' }],
    ['@semantic-release/git', { assets: ['CHANGELOG.md', 'dist/**'] }],
    // Evitamos issues automáticos si falla
    ['@semantic-release/github', { failComment: false, labels: false }],
  ],
}
