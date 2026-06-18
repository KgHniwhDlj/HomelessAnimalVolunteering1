let employeeBtn = document.getElementById('employee-btn');
let employees = document.getElementById('employees');
let enclosures = document.getElementById('enclosures');

export function displayEmployees() {
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

export function displayEnclosures() {
  let enclosuresTable = document.getElementById('enclosures-main-table');

  if (!enclosuresTable) return;

  enclosuresTable.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Размер (кв. м)</th>
            <th>Дата</th>
            <th>Адрес</th>
        </tr>
  `;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('enclosure_')) {
      let enclosureData = JSON.parse(localStorage.getItem(key));
      let row = document.createElement('tr');
      row.innerHTML = `
                <td>${enclosureData.id}</td>
                <td>${enclosureData.name}</td>
                <td>${enclosureData.size}</td>
                <td>${enclosureData.date}</td>
                <td>${enclosureData.address}</td>
            `;

      enclosuresTable.appendChild(row);
    }
  }
}

function selectButton(clickedButton) {
  let buttons = document.querySelectorAll('.toggle-btn');
  buttons.forEach((btn) => btn.classList.remove('active'));
  clickedButton.classList.add('active');

  if(employeeBtn.classList.contains('active')){
    enclosures.style.display = 'none';
    employees.style.display = 'flex';
  } else {
    employees.style.display = 'none';
    enclosures.style.display = 'flex';
  }
}

window.selectButton = selectButton;
document.addEventListener('DOMContentLoaded', () => {
  displayEmployees();
  displayEnclosures();
  });