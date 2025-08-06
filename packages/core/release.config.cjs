// packages/core/release.config.cjs
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    ['@semantic-release/release-notes-generator', {
      preset: 'conventionalcommits',
      // Fix: si falta/rompe la fecha del commit, ponemos una ISO válida
      writerOpts: {
        transform: (commit) => {
          try {
            const d = commit && commit.committerDate ? new Date(commit.committerDate) : null
            if (!d || isNaN(d)) {
              commit.committerDate = new Date().toISOString()
            }
          } catch {
            commit.committerDate = new Date().toISOString()
          }
          return commit
        }
      }
    }],
    '@semantic-release/changelog',
    ['@semantic-release/npm', { npmPublish: true }],
    ['@semantic-release/git', { assets: ['CHANGELOG.md', 'dist/**'] }],
    ['@semantic-release/github', { failComment: false, labels: false }]
  ]
}
