const authorizationBtn = document.getElementById('submit-btn');


function authenticate() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');

    let userEmail = email.value.trim();
    let userPassword = password.value;
    if (userEmail === '' || userPassword === '') {
      alert('Пожалуйста, введите данные');
      return;
    }
    if (userEmail === 'admin@example.com' && userPassword === 'admin123') {
      window.location.href = 'mainAdmin.html';
      return;
    }

  let foundEmployee = null;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('employee_')) {
      let existingEmployee = JSON.parse(localStorage.getItem(key));


      if (
        existingEmployee.email.toLocaleLowerCase() === userEmail.toLocaleLowerCase()
      ) {
        foundEmployee = existingEmployee;
      }
    }
  }
  if (foundEmployee === null) {
    alert("Пользователя с такой почтой не существует!");
    return;
  }
  if (foundEmployee && foundEmployee.password !== userPassword) {
    alert("Неверный пароль!");
    return;
  }

    localStorage.setItem('current_user_id', foundEmployee.id);
    window.location.href = 'mainUser.html';

}

authorizationBtn.addEventListener('click', authenticate);