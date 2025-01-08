const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// File paths for guests and responses data
const GUESTS_FILE = './guests.json';
const RESPONSES_FILE = './responses.json';

// Get responses to display in the admin panel
app.get('/responses', (req, res) => {
  fs.readFile(RESPONSES_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Błąd serwera.');
    }
    res.json(JSON.parse(data));
  });
});

// Handle RSVP submission
app.post('/submit', (req, res) => {
  const { code, attendance } = req.body;

  fs.readFile(RESPONSES_FILE, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Błąd serwera.');
    }
    const responses = JSON.parse(data);
    const existingResponseIndex = responses.findIndex(r => r.code === code);

    if (existingResponseIndex >= 0) {
      // Update the existing response
      responses[existingResponseIndex].attendance = attendance;
    } else {
      // Add a new response
      responses.push({ code, attendance });
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
