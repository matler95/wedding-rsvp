// Wczytaj dane gościa na podstawie kodu z URL
const urlParams = new URLSearchParams(window.location.search);
const guestCode = urlParams.get('code');

fetch('guests.json')
  .then(response => response.json())
  .then(guests => {
    const guest = guests.find(g => g.code === guestCode);
    const guestInfo = document.getElementById('guestInfo');
    const rsvpForm = document.getElementById('rsvpForm');
    const individualOptions = document.getElementById('individualOptions');
    const coupleOptions = document.getElementById('coupleOptions');

    if (guest) {
      guestInfo.innerHTML = `<p>Witaj, ${guest.name}!</p>`;
      rsvpForm.style.display = 'block';

      if (guest.isCouple) {
        coupleOptions.style.display = 'block';
        const names = guest.name.split(' i '); // Podziel imiona pary
        coupleOptions.querySelectorAll('label').forEach((label, index) => {
          label.querySelector('input').name = `guest${index + 1}`;
          label.querySelector('input').value = names[index];
          label.innerHTML = `<input type="checkbox" name="guest${index + 1}" value="${names[index]}"> ${names[index]}`;
        });
      } else {
        individualOptions.style.display = 'block';
      }
    } else {
      guestInfo.innerHTML = `<p>Błąd: Nie znaleziono gościa.</p>`;
    }
  });

// Obsługa wysyłania formularza
document.getElementById('rsvpForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const attendance = [];
  if (document.getElementById('individualOptions').style.display === 'block') {
    const individualAttendance = document.querySelector('input[name="attendance"]:checked').value;
    attendance.push(individualAttendance === 'yes' ? 'Obecny' : 'Nieobecny');
  }

  if (document.getElementById('coupleOptions').style.display === 'block') {
    const coupleAttendance = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    attendance.push(...coupleAttendance);
  }

  const responseElement = document.getElementById('response');
  if (attendance.length > 0) {
    responseElement.innerHTML = `<p>Dziękujemy za potwierdzenie! Obecni: ${attendance.join(', ')}</p>`;
  } else {
    responseElement.innerHTML = `<p>Dziękujemy za informację! Nikt z Państwa nie będzie obecny.</p>`;
  }
});
