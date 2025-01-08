// Fetch guest data based on the URL parameter (QR code)
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

      // Display attendance options
      if (guest.isCouple) {
        coupleOptions.style.display = 'block';
        const names = guest.name.split(' i '); // Split names if it's a couple
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

// Handle form submission and save response
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

  // Post the response to the server
  fetch('/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: guestCode,  // Send the guest code to identify the response
      attendance: attendance,
    })
  })
  .then(response => response.text())
  .then(message => {
    const responseElement = document.getElementById('response');
    responseElement.innerHTML = `<p>${message}</p>`;
  })
  .catch(error => {
    console.error('Error submitting RSVP:', error);
    alert('Wystąpił błąd. Spróbuj ponownie.');
  });
});
