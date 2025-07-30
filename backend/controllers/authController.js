const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../data/db.js");


function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email e password obbligatorie" });

    const checkSql = `SELECT * FROM users WHERE email = ?`;

    connection.query(checkSql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Errore server (check email)" });
        if (results.length > 0) return res.status(409).json({ error: "Utente già esistente" });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "Errore nel hashing della password" });

            const insertSql = "INSERT INTO users (email, password) VALUES (?, ?)";

            connection.query(insertSql, [email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: "Errore server (inserimento)" });

                res.status(201).json({ message: "Registrazione completata" });
            });
        });
    });
}

function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Email e password obbligatorie" });

    const sql = `SELECT * FROM users WHERE email = ?`;

    connection.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Errore server (query login)" });
        if (results.length === 0) return res.status(401).json({ error: "Credenziali non valide" });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Errore durante la verifica della password" });
            if (!isMatch) return res.status(401).json({ error: "Credenziali non valide" });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            res.json({ token });
        });
    });
}

function getMe(req, res) {
    const userId = req.user.id;

    const sql = `SELECT id, email FROM users WHERE id = ?`;

    connection.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Errore nel recupero utente" });
        if (results.length === 0) return res.status(404).json({ error: "Utente non trovato" });

        const user = results[0];
        res.json(user);
    });
}


module.exports = { register, login, getMe };