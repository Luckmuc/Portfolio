const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs/promises');

const app = express();
const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'guestbook.json');
const MAX_ENTRIES = 100;

const ensureDataFile = async () => {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.writeFile(DATA_FILE, '[]', 'utf-8');
    }
};

const readEntries = async () => {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
};

const writeEntries = async (entries) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
};

const apiRouter = express.Router();

apiRouter.get('/guestbook', async (_req, res) => {
    try {
        const entries = await readEntries();
        entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(entries);
    } catch (error) {
        console.error('Failed to load guestbook entries', error);
        res.status(500).json({ error: 'Failed to load entries.' });
    }
});

apiRouter.post('/guestbook', async (req, res) => {
    const { name, message } = req.body || {};
    const trimmedName = (name || '').toString().trim().slice(0, 60);
    const trimmedMessage = (message || '').toString().trim().slice(0, 500);

    if (!trimmedName || !trimmedMessage) {
        return res.status(400).json({ error: 'Name and message are required.' });
    }

    const entry = {
        id: Date.now().toString(),
        name: trimmedName,
        message: trimmedMessage,
        timestamp: new Date().toISOString()
    };

    try {
        const entries = await readEntries();
        entries.unshift(entry);
        await writeEntries(entries.slice(0, MAX_ENTRIES));
        res.status(201).json(entry);
    } catch (error) {
        console.error('Failed to save guestbook entry', error);
        res.status(500).json({ error: 'Failed to save entry.' });
    }
});

app.use(cors());
app.use(express.json());

app.get('/guestbook-config.js', (_req, res) => {
    const apiBase = (process.env.GUESTBOOK_API_BASE || '/api').replace(/\/$/, '');
    res.type('application/javascript');
    res.set('Cache-Control', 'no-cache');
    res.send(`window.__GUESTBOOK_API_BASE__ = ${JSON.stringify(apiBase)};`);
});

app.use('/api', apiRouter);
app.use(express.static(path.join(__dirname, 'public')));

ensureDataFile()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to initialize guestbook storage.', error);
        process.exit(1);
    });
