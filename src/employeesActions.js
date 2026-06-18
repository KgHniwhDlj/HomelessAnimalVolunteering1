let employeesDeletion = document.getElementById('employee-deletion');
let employeeDeletionInfo = document.getElementById('employee-deletion-info');
let employeeIdToDelete = document.getElementById('id-employee-deletion');
let employeesEditing = document.getElementById('employee-editing');
let employeeEditingForm = document.getElementById('employee-editing-form');
let employeeIdToEdit = document.getElementById('id-employee-editing');
let createEmployeeForm = document.getElementById('employee-creation-form');
import { displayEmployees } from './mainAdmin.js';

function createEmployee() {
  if (createEmployeeForm.style.display === 'none') {
    createEmployeeForm.style.display = 'block';
  } else {
    createEmployeeForm.style.display = 'none';
  }
}

function createNewEmployee() {
  let newEmployeeName = document.getElementById('input-employee-name').value;
  let newEmployeeEmail = document.getElementById('input-employee-email').value;
  let newEmployeePhone = document.getElementById('input-employee-phone').value;
  let newEmployeeAddress = document.getElementById(
    'input-employee-address',
  ).value;
  let newEmployeePassword = document.getElementById(
    'input-employee-password',
  ).value;

  let employeeID = Date.now();

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
    alert(
      "Неверный формат телефона! Номер должен начинаться с '+' и содержать только цифры.",
    );
    return;
  }

  let nameValue = newEmployeeName.trim();
  let nameParts = nameValue.split(' ');
  if (nameParts.length !== 3) {
    alert('Имя неверно указано.');
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('employee_')) {
      let existingEmployee = JSON.parse(localStorage.getItem(key));

      if (existingEmployee.phone === newEmployeePhone) {
        alert('Сотрудник с таким номером телефона существует!');
        return;
      }

      if (
        existingEmployee.email.toLocaleLowerCase() ===
        newEmployeeEmail.toLocaleLowerCase()
      ) {
        alert('Эта электронная почта занята!');
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

  localStorage.setItem('employee_' + employeeID, JSON.stringify(employeeData));

  window.location.href = 'mainAdmin.html';
}

function deleteEmployee() {
  if (employeesDeletion.style.display === 'none') {
    employeesDeletion.style.display = 'block';
  } else {
    employeesDeletion.style.display = 'none';
    employeeDeletionInfo.style.display = 'none';
  }
}

function findEmployeeToDelete() {
  let targetId = employeeIdToDelete.value.trim();

  if (targetId === '') {
    alert('Пожалуйста, введите значение!');
    return;
  }

  let foundEmployee = null;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('employee_')) {
      let employeeData = JSON.parse(localStorage.getItem(key));
      if (String(employeeData.id) === targetId) {
        foundEmployee = employeeData;
        break;
      }
    }
  }

  if (!foundEmployee) {
    alert('Сотрудник с таким ID не найден!');
    employeeDeletionInfo.style.display = 'none';
    return;
  }

  let deletionTable = employeeDeletionInfo.querySelector('.employee-table');

  while (deletionTable.rows.length > 1) {
    deletionTable.deleteRow(1);
  }

  let row = document.createElement('tr');
  row.innerHTML = `
    <td>${foundEmployee.id}</td>
    <td>${foundEmployee.name}</td>
    <td>${foundEmployee.email}</td>
    <td>${foundEmployee.phone}</td>
    <td>${foundEmployee.address}</td>
    <td>${foundEmployee.role}</td>
    <td>${foundEmployee.password}</td>
  `;
  deletionTable.appendChild(row);

  employeeDeletionInfo.style.display = 'block';
}

function confirmEmployeeDeletion() {
  let targetId = employeeIdToDelete.value.trim();

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('employee_')) {
      let employeeData = JSON.parse(localStorage.getItem(key));
      if (String(employeeData.id) === targetId) {
        localStorage.removeItem(key);
        alert('Сотрудник успешно удален!');

        employeeDeletionInfo.style.display = 'none';
        employeeIdToDelete.value = '';

        displayEmployees();
        return;
      }
    }
  }
  window.location.href = 'mainAdmin.html';
}

function editEmployee() {
  if (
    employeesEditing.style.display === 'none' ||
    employeesEditing.style.display === ''
  ) {
    employeesEditing.style.display = 'block';
  } else {
    employeesEditing.style.display = 'none';
    employeeEditingForm.style.display = 'none';
  }
}

function findEmployeeToEdit() {
  let targetId = employeeIdToEdit.value.trim();

  if (targetId === '') {
    alert('Пожалуйста, введите ID сотрудника!');
    return;
  }

  let foundEmployeeToEdit = null;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('employee_')) {
      let employeeData = JSON.parse(localStorage.getItem(key));
      if (String(employeeData.id) === targetId) {
        foundEmployeeToEdit = employeeData;
        break;
      }
    }
  }

  if (!foundEmployeeToEdit) {
    alert('Сотрудник с таким ID не найден!');
    employeeEditingForm.style.display = 'none';
    return;
  }

  document.getElementById('edit-employee-name').value =
    foundEmployeeToEdit.name;
  document.getElementById('edit-employee-email').value =
    foundEmployeeToEdit.email;
  document.getElementById('edit-employee-phone').value =
    foundEmployeeToEdit.phone;
  document.getElementById('edit-employee-address').value =
    foundEmployeeToEdit.address;
  document.getElementById('edit-employee-password').value =
    foundEmployeeToEdit.password;

  employeeEditingForm.style.display = 'block';
}

function saveEmployeeChanges() {
  let targetId = employeeIdToEdit.value.trim();

  let updatedName = document.getElementById('edit-employee-name').value.trim();
  let updatedEmail = document
    .getElementById('edit-employee-email')
    .value.trim();
  let updatedPhone = document
    .getElementById('edit-employee-phone')
    .value.trim();
  let updatedAddress = document
    .getElementById('edit-employee-address')
    .value.trim();
  let updatedPassword = document.getElementById('edit-employee-password').value;

  if (
    updatedName === '' ||
    updatedEmail === '' ||
    updatedPhone === '' ||
    updatedAddress === '' ||
    updatedPassword === ''
  ) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('employee_')) {
      let employeeData = JSON.parse(localStorage.getItem(key));

      if (String(employeeData.id) === targetId) {
        let updatedData = {
          id: employeeData.id,
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone,
          role: employeeData.role,
          address: updatedAddress,
          password: updatedPassword,
        };

        localStorage.setItem(key, JSON.stringify(updatedData));
        alert('Данные сотрудника успешно изменены!');

        employeeEditingForm.style.display = 'none';
        employeesEditing.style.display = 'none';
        employeeIdToEdit.value = '';
        displayEmployees();
        return;
      }
    }
  }
}

function findEmployeeForm() {
  let findForm = document.getElementById('find-employee-container');

  if (findForm.style.display === 'none') {
    findForm.style.display = 'block';
  } else {
    findForm.style.display = 'none';
  }
}

function renderFoundTable(foundEmployees, tableId) {
  const table = document.getElementById(tableId);

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  if (foundEmployees.length === 0) {
    alert('Совпадения не найдены!');
    return;
  }

  foundEmployees.forEach((employee) => {
    let row = table.insertRow();

    row.insertCell(0).innerText = employee.id || '-';
    row.insertCell(1).innerText = employee.name || '-';
    row.insertCell(2).innerText = employee.email || '-';
    row.insertCell(3).innerText = employee.phone || '-';
    row.insertCell(4).innerText = employee.address || '-';
    row.insertCell(5).innerText = employee.role || '-';
    row.insertCell(6).innerText = employee.password;
  });
}


function findEmployee(input) {
  let data = document.getElementById(input).value.trim().toLowerCase();

  if (!data) return;

  let foundEmployees = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('employee_')) {
      let employee = JSON.parse(localStorage.getItem(key));

      let matchName =
        employee.name && employee.name.toLowerCase().includes(data);
      let matchId = employee.id && employee.id.toString() === data;
      let matchEmail =
        employee.email && employee.email.toLowerCase().includes(data);
      let matchPhone =
        employee.phone && employee.phone.toString().includes(data);
      let matchAddress =
        employee.address && employee.address.toLowerCase().includes(data);
      let matchRole =
        employee.role && employee.role.toLowerCase().includes(data);
      let matchPassword =
        employee.password && employee.password.toLowerCase().includes(data);


      if (
        matchName ||
        matchId ||
        matchEmail ||
        matchPhone ||
        matchAddress ||
        matchRole ||
        matchPassword
      ) {
        foundEmployees.push(employee);
      }
    }
  }
  renderFoundTable(foundEmployees, 'found-employee-table');
}

window.createEmployee = createEmployee;
window.createNewEmployee = createNewEmployee;
window.deleteEmployee = deleteEmployee;
window.findEmployeeToDelete = findEmployeeToDelete;
window.confirmEmployeeDeletion = confirmEmployeeDeletion;
window.editEmployee = editEmployee;
window.findEmployeeToEdit = findEmployeeToEdit;
window.saveEmployeeChanges = saveEmployeeChanges;
window.findEmployeeForm = findEmployeeForm;
window.findEmployee = findEmployee;