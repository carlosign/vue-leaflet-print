// packages/core/release.config.cjs
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
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
    // ✅ Solo PREPARE (escribe versión en dist), NO publica
    ['@semantic-release/npm', { npmPublish: false, pkgRoot: 'dist' }],
    ['@semantic-release/git', { assets: ['CHANGELOG.md', 'dist/**'] }],
    // ✅ Publicamos nosotros explícitamente desde dist
    ['@semantic-release/exec', {
      // corre después de prepare: dist/package.json ya tiene la versión nueva
       publishCmd: 'bash -lc "cd dist && npm publish --access public"'
    }],
    ['@semantic-release/github', { failComment: false, labels: false }],
  ],
}
