// Fetch the responses to display in the table
fetch('/responses')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector('#responsesTable tbody');
    tableBody.innerHTML = ''; // Clear any existing rows

    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">Brak odpowiedzi</td></tr>';
      return;
    }

    data.forEach(entry => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const attendanceCell = document.createElement('td');
      const notesCell = document.createElement('td');

      nameCell.textContent = entry.name;
      attendanceCell.textContent = entry.attendance.join(', ') || 'Nieobecny';
      notesCell.textContent = entry.notes || '-';

      row.appendChild(nameCell);
      row.appendChild(attendanceCell);
      row.appendChild(notesCell);
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Błąd podczas wczytywania danych:', error);
    const tableBody = document.querySelector('#responsesTable tbody');
    tableBody.innerHTML = '<tr><td colspan="3">Błąd podczas wczytywania danych</td></tr>';
  });
