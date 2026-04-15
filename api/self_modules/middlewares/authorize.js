const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

module.exports = (req, res, callback) => {
    jwt.verify(req.headers.token, '', (error, payload) => {
        if (error) {
            res.status(500).send(error + '. Please contact the webmaster')
        } else {
            // ajout du code pour la création du log
            // Création du log
            const now = new Date().toLocaleString();
            const logEntry = `[${now}] Payload : user_ID="${payload.user_id}", user_role="${payload.user_role}"\n`;

            // Chemin du fichier log
            const logPath = path.join(__dirname, '../../tokens.log');

            // Écriture dans le fichier
            fs.appendFile(logPath, logEntry, (err) => {
                if (err) {
                    console.error("Erreur lors de l'écriture du log :", err);
                }
            });
            // fin du code du log

            req.body.user_id = payload.user_id
            req.body.user_role = payload.user_role
            callback();
        }
    });
}