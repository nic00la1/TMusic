const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tmusic' //sprawdzić nazwę bazy
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to Database!');
});

app.listen(3001, () => {
  console.log("Server port: 3001");
});

app.get('/genres', (req, res) => {
  const sql = 'SELECT * FROM Genres';

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: 'Database query error'});
    res.json(results);
  });

});

app.get('/authors', (req, res) => {

  const sql = 'SELECT * FROM Authors';

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: 'Database query error'});
    res.json(results);
  });
});

app.get('/songs', (req, res) => {

  const sql = `

    SELECT s.ID, s.title, s.ID_author, a.name AS author_name, a.surname AS author_surname,
           s.ID_genre, g.name AS genre_name, s.Score, s.Popularity
    FROM Songs s
    JOIN Authors a ON s.ID_author = a.ID
    JOIN Genres g ON s.ID_genre = g.ID
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: 'Database query error'});
    res.json(results);
  });
});

app.post('/songs', (req, res) => {
  const { title, ID_author, ID_genre, Score, Popularity } = req.body;
  const sql = 'INSERT INTO Songs (title, ID_author, ID_genre, Score, Popularity) VALUES (?, ?, ?, ?, ?)';

  connection.query(sql, [title, ID_author, ID_genre, Score, Popularity], (err, results) => {
    if (err) return res.status(500).json({error: 'Database insert error'});
    res.json({message: 'Song added', songId: results.insertId});
  });
});

app.put('/songs/:id', (req, res) => {

  const { id } = req.params;
  const { title } = req.body;
  const sql = `

    UPDATE Songs
    SET title = ?
    WHERE ID = ?
  `;

  connection.query(sql, [title, id], (err, results) => {
    if (err) return res.status(500).json({error: 'Database update error'});
    if (results.affectedRows === 0) return res.status(404).json({error: 'Song not found'});
    res.json({message: 'Song updated'});
  });

});

//dopisać endpoint do zad 4
app.get('/songs/top10/:sortBy', (req, res) => {
  const { sortBy } = req.params;
  
  // Validate sortBy parameter
  if (sortBy !== 'popularity' && sortBy !== 'score') {
    return res.status(400).json({error: 'Invalid sortBy parameter. Use "popularity" or "score"'});
  }
  
  const orderColumn = sortBy === 'popularity' ? 'Popularity' : 'Score';
  
  const sql = `
    SELECT s.ID, s.title, 
           CONCAT(a.name, ' ', a.surname) AS author_name,
           s.Popularity, s.Score
    FROM Songs s
    JOIN Authors a ON s.ID_author = a.ID
    ORDER BY ${orderColumn} DESC
    LIMIT 10
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({error: 'Database query error'});
    res.json(results);
  });
});
