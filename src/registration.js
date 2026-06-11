const registrationBtn = document.getElementById('registration-btn');
const createEmployeeBtn = document.getElementById('create-employee-btn');

// function registration() {
//   let newEmail = document.getElementById('new-email');
//   let newPassword = document.getElementById('new-password');
//
//   let userEmail = newEmail.value;
//   let userPassword = newPassword.value;
//   if (userEmail === '' || userPassword === '') {
//     alert('Пожалуйста, введите данные');
//   } else if (userPassword.length < 8) {
//     alert('Пароль слишком короткий!');
//   } else if (!userEmail.includes('@')) {
//     alert('Неверный формат электронной почты!');
//   } else if (userEmail === 'admin@example.com' || userPassword === 'admin123') {
//     alert('Нельзя!');
//   } else {
//     window.location.href = 'mainUser.html';
//   }
// }

function createEmployee() {
  let newEmployeeName = document.getElementById('input-employee-name').value;
  let newEmployeeEmail = document.getElementById('input-employee-email').value;
  let newEmployeePhone = document.getElementById('input-employee-phone').value;
  let newEmployeeAddress = document.getElementById(
    'input-employee-address',
  ).value;
  let newEmployeePassword = document.getElementById(
    'input-employee-password',
  ).value;
  let employeeID = localStorage.length+1;

  if (
    newEmployeeName === '' ||
    newEmployeeEmail === '' ||
    newEmployeePhone === '' ||
    newEmployeeAddress === '' ||
    newEmployeePassword === '' ||
    newEmployeePassword === ''
  ) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  if (newEmployeePassword.length < 8) {
    alert('Пароль слишком короткий!');
    return;
  }
  if (!newEmployeeEmail.includes('@')) {
    alert('Неверный формат электронной почты!');
    return;
  }
  if (newEmployeeEmail === 'admin@example.com') {
    alert('Нельзя!');
    return;
  }

  let phonePattern = /^\+[0-9]{7,15}$/;

  if (!phonePattern.test(newEmployeePhone.trim())) {
    alert("Неверный формат телефона! Номер должен начинаться с '+' и содержать только цифры.");
    return;
  }

  let nameValue = newEmployeeName.trim()
  let nameParts = nameValue.split(' ');
  if (nameParts.length !== 3) {
    alert("Имя неверно указано.")
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('employee_')) {
      let existingEmployee = JSON.parse(localStorage.getItem(key));

      if (existingEmployee.phone === newEmployeePhone) {
        alert("Сотрудник с таким номером телефона существует!");
        return;
      }

      if (existingEmployee.email.toLocaleLowerCase() === newEmployeeEmail.toLocaleLowerCase() ) {
        alert("Эта электронная почта занята!");
        return;
      }
    }
  }


    let employeeData = {
      id: employeeID,
      name: newEmployeeName,
      email: newEmployeeEmail,
      phone: newEmployeePhone,
      role: 'employee',
      address: newEmployeeAddress,
      password: newEmployeePassword,
    };

    localStorage.setItem(
      'employee_' + employeeID,
      JSON.stringify(employeeData),
    );
    window.location.href = 'mainAdmin.html';

}

createEmployeeBtn.addEventListener('click', createEmployee);
//registrationBtn.addEventListener('click', registration);