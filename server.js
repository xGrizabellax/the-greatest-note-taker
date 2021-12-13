const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('./helpers/uuid')
let notes = require('./db/notes.json')

const PORT = 3001;

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`)

    const { title, text } = req.body;

    const newNote = {
        title,
        text,
        id: uuid(),
    };

    notes.push(newNote)
    console.log(notes)

    fs.writeFile(`./db/notes.json`, JSON.stringify(notes), (err) =>
        err
            ? console.log(err)
            : console.log(
                `Note for ${newNote.title} has been written to JSON file`),
    );

    res.json(notes)

});

app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(x => x.id !== req.params.id)
    // console.log(newNoteString)
    
    res.json(notes)

    fs.writeFile(`./db/notes.json`, JSON.stringify(notes), (err) =>
        err
            ? console.log(err)
            : console.log(
                `Note for ${notes} has been written to JSON file`),
    );
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
