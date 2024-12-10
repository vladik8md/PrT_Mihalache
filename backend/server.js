const express = require('express');
const multer = require('multer');
const { simpleParser } = require('mailparser');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const regexes = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /\+40\s?\d{2,3}(\s?\d{2,3}){2,3}/g,
    url: /https?:\/\/(www\.)?[a-zA-Z0-9._%+-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9._%+-]*)*/g,
    ip: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
};

function removeDuplicates(array) {
    return [...new Set(array)];
}

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Fișierul nu a fost încărcat!' });
    }

    try {
        const emailContent = req.file.buffer.toString();
        const parsedEmail = await simpleParser(emailContent);

        const result = {
            from: parsedEmail.from?.text || 'Necunoscut',
            to: parsedEmail.to?.text || 'Necunoscut',
            subject: parsedEmail.subject || 'Fără subiect',
            date: parsedEmail.date || 'Dată necunoscută',
            body: parsedEmail.text || 'Fără conținut',
        };

        const extractedData = {
            emails: removeDuplicates(emailContent.match(regexes.email) || []),
            phones: removeDuplicates(emailContent.match(regexes.phone) || []),
            urls: removeDuplicates(emailContent.match(regexes.url) || []),
            ips: removeDuplicates(emailContent.match(regexes.ip) || []),
        };

        res.json({ ...result, ...extractedData });
    } catch (error) {
        console.error('Eroare la procesarea email-ului:', error.message);
        res.status(500).json({ error: 'Eroare la procesarea email-ului.' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe http://localhost:${PORT}`);
});
