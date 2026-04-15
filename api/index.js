require("dotenv").config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors')
const router = require('./self_modules/routes/routes');
const routerSecure = require('./self_modules/routes/routesSecure');
const authorize = require('./self_modules/middlewares/authorize');
const corsOptions = require('./self_modules/middlewares/cors');
const cookieParser = require('cookie-parser');
const logger = require('./self_modules/middlewares/logger');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json({limit:"1.1MB"}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors(corsOptions))
// 📋 Forensic logging – logs every request to logs/access.log
app.use(logger);

// API routes
app.use('/api', router);
app.use('/api', authorize, routerSecure);

// Legacy routes (sans /api) pour compatibilité
app.post('/connection', require('./controllers/dataController').connectUser);
app.use('/user', authorize, (req, res) => require('./controllers/dataController').fetchDataUser(req, res));
app.use('/admin', authorize, require('./self_modules/middlewares/checkIfAdmin'), (req, res) => require('./controllers/dataController').getVictory(req, res));
app.get('/blog', authorize, (req, res) => require('./controllers/dataController').fetchBlogMessages(req, res));
app.post('/blog', authorize, (req, res) => require('./controllers/dataController').createBlogmessage(req, res));

// SPA catch-all : toutes les autres routes servent index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.info(`[SERVER] Listening on http://localhost:${port}`); 
})