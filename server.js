const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static('public'));


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});


const readNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db/db.json'), 'utf8');
  return JSON.parse(data);
};


const writeNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2));
};

app.get('/api/notes', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});


app.post('/api/notes', (req, res) => {
  const notes = readNotes();
  const newNote = { id: uuidv4(), ...req.body };
  notes.push(newNote);
  writeNotes(notes);
  res.json(newNote);
});


app.delete('/api/notes/:id', (req, res) => {
  let notes = readNotes();
  const { id } = req.params;
  notes = notes.filter(note => note.id !== id);
  writeNotes(notes);
  res.json({ success: true });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});