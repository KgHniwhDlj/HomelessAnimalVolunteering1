const registrationBtn = document.getElementById('registration-btn');

function registration() {
  let newEmail = document.getElementById('new-email');
  let newPassword = document.getElementById('new-password');

  let userEmail = newEmail.value;
  let userPassword = newPassword.value;
  if (userEmail === '' || userPassword === '') {
    alert('Пожалуйста, введите данные');
  } else if (userPassword.length < 8) {
    alert('Пароль слишком короткий!');
  } else if (!userEmail.includes('@')) {
    alert('Неверный формат электронной почты!');
  } else if (userEmail === 'admin@example.com' || userPassword === 'admin123') {
    alert('Нельзя!');
  } else
  {
    window.location.href = 'mainUser.html';
  }
}

registrationBtn.addEventListener('click', registration);