// En production, accepter l'origine de production
// En développement, accepter localhost
var whitelist = [
  'http://localhost:8080', 
  'http://localhost:3000', 
  'http://localhost:3001',
  process.env.RENDER_EXTERNAL_URL // URL de production Render
].filter(Boolean); // Enlever les undefined

module.exports = corsOptions = {
  origin: function (origin, callback) {
    // En production sur Render, le frontend et l'API sont sur la même origine
    // donc origin peut être undefined ou l'URL de Render
    if (whitelist.indexOf(origin) !== -1 || origin === undefined || process.env.NODE_ENV === 'production') {
      let corsOption = {origin: true}
      callback(null, corsOption)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}