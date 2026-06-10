export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecretkey',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  news: {
    apiKey: process.env.NEWS_API_KEY || '',
    apiUrl: process.env.NEWS_API_URL || 'https://newsapi.org/v2',
    sportsApiKey: process.env.SPORTS_API_KEY || '',
    sportsApiUrl: process.env.SPORTS_API_URL || 'https://v3.football.api-sports.io',
  },
  upload: {
    dest: process.env.UPLOAD_DEST || './uploads',
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300', 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
