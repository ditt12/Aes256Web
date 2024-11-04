const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/')));

// Route untuk menyajikan index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fungsi enkripsi
function encrypt(text, key) {
    const algorithm = 'aes-256-cbc';
    const iv = crypto.randomBytes(16);

    // Pastikan panjang kunci minimal 1 huruf
    if (key.length < 1) {
        return null; // Mengembalikan null jika kunci tidak valid
    }

    // Pad kunci jika panjangnya kurang dari 32 byte
    const paddedKey = Buffer.from(key.padEnd(32, ' '));

    let cipher = crypto.createCipheriv(algorithm, paddedKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted.toString('hex'),
        key: paddedKey.toString('hex')
    };
}

// Route untuk enkripsi
app.post('/encrypt', (req, res) => {
    const { script, key } = req.body;
    const encrypted = encrypt(script, key);
    
    if (!encrypted) {
        return res.status(400).json({ error: "Kunci harus memiliki minimal 1 huruf." });
    }

    res.json({ encrypted: encrypted.encryptedData });
});

// Server berjalan
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
