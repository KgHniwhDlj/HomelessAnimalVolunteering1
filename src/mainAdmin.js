let employeeBtn = document.getElementById('employee-btn');
let enclosureBtn = document.getElementById('enclosure-btn');
let employees = document.getElementById('employees');
let enclosures = document.getElementById('enclosures');
let employeesDeletion = document.getElementById('employee-deletion');
let employeeDeletionInfo = document.getElementById('employee-deletion-info');
let employeeDeletionFoundBtn = document.getElementById('deletion-employee-found-btn');
let employeeDeletionSubmitBtn = document.getElementById('deletion-employee-btn');
let employeeIdToDelete = document.getElementById('id-employee-deletion');
let employeesEditing = document.getElementById('employee-editing');
let employeeEditingForm = document.getElementById('employee-editing-form');
let employeeIdToEdit = document.getElementById('id-employee-editing');
let saveEmployeeChangesBtn = document.getElementById(
  'save-employee-changes-btn',
);


function displayEmployees() {
  let table = document.getElementById('employee-main-table');

  if (!table) return;

  table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>ФИО сотрудника</th>
            <th>Почта</th>
            <th>Телефон</th>
            <th>Адрес</th>
            <th>Роль</th>
            <th>Пароль</th>
        </tr>
  `;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('employee_')) {
      let employeeData = JSON.parse(localStorage.getItem(key));
      let row = document.createElement('tr');
      row.innerHTML = `
                <td>${employeeData.id}</td>
                <td>${employeeData.name}</td>
                <td>${employeeData.email}</td>
                <td>${employeeData.phone}</td>
                <td>${employeeData.address}</td>
                <td>${employeeData.role}</td>
                <td>${employeeData.password}</td>
            `;

      table.appendChild(row);
    }
  }

}



function selectButton(clickedButton) {
  let buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach((btn) => btn.classList.remove('active'));
  clickedButton.classList.add('active');

  if(employeeBtn.classList.contains('active')){
    enclosures.style.display = 'none';
    employees.style.display = 'block';
  } else {
    employees.style.display = 'none';
    enclosures.style.display = 'block';
  }
}

const createEmployeeBtn = document.getElementById('create-employee-btn');

function createEmployee() {
 window.location.href = 'registration.html';
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

function confirmDeletion() {
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
    alert("Пожалуйста, введите ID сотрудника!");
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
    alert("Сотрудник с таким ID не найден!");
    employeeEditingForm.style.display = 'none';
    return;
  }

  document.getElementById('edit-employee-name').value = foundEmployee.name;
  document.getElementById('edit-employee-email').value = foundEmployee.email;
  document.getElementById('edit-employee-phone').value = foundEmployee.phone;
  document.getElementById('edit-employee-address').value = foundEmployee.address;
  document.getElementById('edit-employee-password').value = foundEmployee.password;

  employeeEditingForm.style.display = 'block';
}

function saveEmployeeChanges() {
  let targetId = employeeIdToEdit.value.trim();

  let updatedName = document.getElementById('edit-employee-name').value.trim();
  let updatedEmail = document.getElementById('edit-employee-email').value.trim();
  let updatedPhone = document.getElementById('edit-employee-phone').value.trim();
  let updatedAddress = document.getElementById('edit-employee-address').value.trim();
  let updatedPassword = document.getElementById('edit-employee-password').value;

  if (updatedName === '' || updatedEmail === '' || updatedPhone === '' || updatedAddress === '' || updatedPassword === '') {
    alert("Пожалуйста, заполните все поля");
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
          password: updatedPassword
        };

        localStorage.setItem(key, JSON.stringify(updatedData));
        alert("Данные сотрудника успешно изменены!");

        employeeEditingForm.style.display = 'none';
        employeesEditing.style.display = 'none';
        employeeIdToEdit.value = '';
        displayEmployees();
        return;
      }
    }
  }
}


function createEnclosure() {

}

function deleteEnclosure() {

}

function editEnclosure() {

}

document.addEventListener('DOMContentLoaded', displayEmployees);
window.selectButton = selectButton;
window.createEmployee = createEmployee;
window.deleteEmployee = deleteEmployee;
window.findEmployeeToDelete = findEmployeeToDelete;
window.confirmDeletion = confirmDeletion;
window.editEmployee = editEmployee;
window.findEmployeeToEdit = findEmployeeToEdit;
window.saveEmployeeChanges = saveEmployeeChanges;
