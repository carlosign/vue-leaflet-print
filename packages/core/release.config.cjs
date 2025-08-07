module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/changelog',
    ['@semantic-release/npm', {
      // IMPORTANT: trabajamos desde dist tanto en "prepare" como en "publish"
      pkgRoot: 'dist',
      npmPublish: true,     // <-- volver a publicar con este plugin
      tarballDir: false
    }],
    '@semantic-release/git',
    '@semantic-release/github'
  ]
}
