const authorizationBtn = document.getElementById('submit-btn');


function authenticate() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let userEmail = email.value;
    let userPassword = password.value;
    if (userEmail === '' || userPassword === '') {
      alert('Пожалуйста, введите данные');
    } else if (userEmail === 'admin@example.com' && userPassword === 'admin123') {
      window.location.href = 'mainAdmin.html';
    } else if (userPassword.length < 8) {
      alert('Неверный пароль!');
    } else if (!userEmail.includes('@')) {
      alert('Неверный формат электронной почты!');
    } else {
      window.location.href = 'mainUser.html';
    }
}

authorizationBtn.addEventListener('click', authenticate);