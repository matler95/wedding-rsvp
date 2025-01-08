const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Ścieżka do plików z danymi
const GUESTS_FILE = './guests.json';
const RESPONSES_FILE = './responses.json';

// Pobierz listę odpowiedzi
app.get('/responses', (req, res) => {
  fs.readFile(RESPONSES_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Błąd serwera.');
    }
    res.json(JSON.parse(data));
  });
});

// Zapisz odpowiedź
app.post('/submit', (req, res) => {
  const response = req.body;

  fs.readFile(RESPONSES_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Błąd serwera.');
    }
    const responses = JSON.parse(data);
    const existingResponseIndex = responses.findIndex(r => r.code === response.code);

    if (existingResponseIndex >= 0) {
      // Aktualizuj istniejącą odpowiedź
      responses[existingResponseIndex] = response;
    } else {
      // Dodaj nową odpowiedź
      responses.push(response);
    }

    fs.writeFile(RESPONSES_FILE, JSON.stringify(responses, null, 2), err => {
      if (err) {
        console.error(err);
        return res.status(500).send('Błąd zapisu danych.');
      }
      res.send('Odpowiedź zapisana!');
    });
  });
});

// Uruchom serwer
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie http://localhost:${PORT}`);
});
