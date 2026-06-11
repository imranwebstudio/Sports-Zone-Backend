// Thin wrapper — path is built at runtime so ncc does NOT bundle the NestJS
// compiled output. Vercel copies dist/** via includeFiles (vercel.json).
const { join } = require('path');
const entry = join(__dirname, '..', 'dist', 'src', 'serverless');
module.exports = require(entry).default;
