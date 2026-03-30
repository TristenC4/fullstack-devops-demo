const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    )
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }

  db.run('INSERT INTO tasks (text) VALUES (?)', [text], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({
      id: this.lastID,
      text
    });
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});