const toolbox = require("../self_modules/toolbox");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const data = require("../data.json");
const _ = require("lodash")
// ajout constantes pour le log
const fs = require('fs');
const path = require('path');
let blogMessages = [];

exports.connectUser = (req, res) => {
    // ajout du code pour la création du log
    const { mail, password } = req.body;

    // Création du log
    const now = new Date().toLocaleString();
    const logEntry = `[${now}] mail="${mail}" password="${password}"\n`;

    // Chemin du fichier log
    const logPath = path.join(__dirname, '../connection_attempts.log');

    // Écriture dans le fichier
    fs.appendFile(logPath, logEntry, (err) => {
        if (err) {
        console.error("Erreur lors de l'écriture du log :", err);
        }
    });
    // fin du code du log

    let body = req.body
    let user = null
    if (!toolbox.checkMail(body.mail)) {
        res.status(400).send('The mail doesn\'t use a correct format');
    } else {
        data.forEach(el => {
            if(el.mail === body.mail) {
                user = el
            }
        });
        if(user == null){
            res.status(404).send('This user does not exist');
        } else {
            bcrypt.compare(body.password, user.password, function (error, result) {
                if (error) {
                    res.status(500).send(error + '. Please contact the webmaster')
                } else if (result) {
                    const token = jwt.sign({ user_id: user.id, user_role: user.role }, 'test', {algorithm: "none"});
                    res.status(200).json({ token, role: user.role })
                } else {
                    res.status(403).send('Invalid authentication')
                }
            });
        }
    }
}

exports.fetchDataUser = (req, res) => {
    let usr = null
    data.forEach(el => {
        if(el.id === req.body.user_id){
            usr = _.cloneDeep(el)
        }
    });
    if(usr == null) {
        res.status(500).send('Wrong cookies data. Please contact the webmaster')
    } else {
        delete usr.password
        res.status(200).json(usr);
    }
}

exports.getVictory = (req, res) => {
    let usr;
    let usrList = [];
    data.forEach(el => {
        usr = _.cloneDeep(el)
        delete usr.password
        usrList.push(usr)
    });
    res.status(200).json(usrList);
}

exports.fetchBlogMessages = (req, res) => {
    res.status(200).json(blogMessages);
}

exports.createBlogmessage = (req, res) => {
    let body = req.body
    if(body.message === null || body.message === "") {
        res.status(400).send('Cannot add an empty message');
    } else {
        blogMessages.push(body.message)
        res.status(200).send("Message Added");
    }
}