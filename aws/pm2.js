module.exports = {
  apps: [
    {
      name: 'rewind-backend',
      script: './rewind/backend/dist/app.js',
      watch: true,
      env: {
        MONGO_URL:
          'mongodb+srv://rewind:rewind@urlshortner.bgf3g.mongodb.net/rewind',
        PORT: 3000,
        SPOTIFY_CLIENT_ID: 'b20cc182688d4f6e846cfb46fc190aa9',
        SPOTIFY_CLIENT_SECRET: 'afc582dde2ed42909fa3e8602038f69c',
        REDIRECT_URL: 'http://65.2.182.155/callback',
        JWT_SECRET: 'Somesecret',
      },
    },
  ],
}
