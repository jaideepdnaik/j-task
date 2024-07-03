const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, './data/data.json');

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
    res.json({
        message: "Hello World",
    });
});

// Read data from JSON file
function readData() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Write data to JSON file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Generate a random token
function generateToken() {
    return crypto.randomBytes(48).toString('hex');
}

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const data = readData();
    const user = data.users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = generateToken();
        data.tokens[token] = user;
        writeData(data);
        res.json({ accessToken: token });
    } else {
        res.status(401).send('Username or password incorrect');
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        console.log("Bearer:", bearer);
        const token = bearer[1];
        console.log("Token:", token);
        
        const data = readData();
        if (data.tokens[token]) {
            req.user = data.tokens[token];
            next();
        } else {
            res.status(403).json({ message: "Invalid token." });
        }
    } else {
        res.status(401).json({ message: "Token is not provided." });
    }
}

// Protected route
app.post("/profile", verifyToken, (req, res) => {
    res.json({
        message: "User is authenticated. Profile is being accessed",
        user: req.user
    });
});
