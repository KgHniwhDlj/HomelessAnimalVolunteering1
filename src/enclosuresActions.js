let enclosureCreating = document.getElementById('create-enclosure-container');
let enclosureDeletion = document.getElementById('delete-enclosure-container');
let enclosureIdToDelete = document.getElementById('id-enclosure-deletion');
let enclosureDeletionInfo = document.getElementById('enclosure-deletion-info');
let enclosureEditing = document.getElementById('edit-enclosure-container');
let enclosureIdToEdit = document.getElementById('id-enclosure-editing');
let enclosureEditingForm = document.getElementById('enclosure-editing-form');
import { displayEnclosures } from './mainAdmin.js';

function createEnclosure() {
  if (
    enclosureCreating.style.display === 'none' ||
    enclosureCreating.style.display === ''
  ) {
    enclosureCreating.style.display = 'block';
  } else {
    enclosureCreating.style.display = 'none';
  }
}

function createNewEnclosure() {
  let newEnclosureName = document.getElementById('input-enclosure-name').value;
  let newEnclosureSize = document.getElementById('input-enclosure-size').value;
  let newEnclosureDate = document.getElementById('input-enclosure-date').value;
  let newEnclosureAddress = document.getElementById(
    'input-enclosure-address',
  ).value;
  let newEnclosureID = Date.now();

  if (
    newEnclosureName === '' ||
    newEnclosureSize === '' ||
    newEnclosureDate === '' ||
    newEnclosureAddress === ''
  ) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('enclosure_')) {
      let existingEnclosure = JSON.parse(localStorage.getItem(key));

      if (existingEnclosure.name.toLowerCase() === newEnclosureName.toLowerCase()) {
        alert('Вольер с таким названием уже существует!');
        return;
      }
    }
  }

  let enclosureData = {
    id: newEnclosureID,
    name: newEnclosureName,
    size: newEnclosureSize,
    date: newEnclosureDate,
    address: newEnclosureAddress,
  };

  localStorage.setItem(
    'enclosure_' + newEnclosureID,
    JSON.stringify(enclosureData),
  );

  displayEnclosures();
}

function deleteEnclosure() {
  if (enclosureDeletion.style.display === 'none') {
    enclosureDeletion.style.display = 'block';
  } else {
    enclosureDeletion.style.display = 'none';
    enclosureDeletionInfo.style.display = 'none';
  }
}

function findEnclosureToDelete() {
  let enclosureTargetId = enclosureIdToDelete.value.trim();

  if (enclosureTargetId === '') {
    alert('Пожалуйста, введите значение!');
    return;
  }

  let foundEnclosure = null;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('enclosure_')) {
      let enclosureData = JSON.parse(localStorage.getItem(key));
      if (String(enclosureData.id) === enclosureTargetId) {
        foundEnclosure = enclosureData;
        break;
      }
    }
  }

  if (!foundEnclosure) {
    alert('Вольер с таким ID не найден!');
    enclosureDeletionInfo.style.display = 'none';
    return;
  }

  let enclosureDeletionTable =
    enclosureDeletionInfo.querySelector('.enclosure-table');

  while (enclosureDeletionTable.rows.length > 1) {
    enclosureDeletionTable.deleteRow(1);
  }

  let row = document.createElement('tr');
  row.innerHTML = `
    <td>${foundEnclosure.id}</td>
    <td>${foundEnclosure.name}</td>
    <td>${foundEnclosure.size}</td>
    <td>${foundEnclosure.date}</td>
    <td>${foundEnclosure.address}</td>
  `;
  enclosureDeletionTable.appendChild(row);

  enclosureDeletionInfo.style.display = 'block';
}

function confirmEnclosureDeletion() {
  let targetId = enclosureIdToDelete.value.trim();

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('enclosure_')) {
      let enclosureData = JSON.parse(localStorage.getItem(key));
      if (String(enclosureData.id) === targetId) {
        localStorage.removeItem(key);
        alert('Вольер успешно удален!');

        enclosureDeletionInfo.style.display = 'none';
        enclosureIdToDelete.value = '';

        displayEnclosures();
        return;
      }
    }
  }
}

function editEnclosure() {
  if (
    enclosureEditing.style.display === 'none' ||
    enclosureEditing.style.display === ''
  ) {
    enclosureEditing.style.display = 'block';
  } else {
    enclosureEditing.style.display = 'none';
    enclosureEditingForm.style.display = 'none';
  }
}

function findEnclosureToEdit() {
  let targetId = enclosureIdToEdit.value.trim();

  if (targetId === '') {
    alert('Пожалуйста, введите ID сотрудника!');
    return;
  }

  let foundEclosure = null;

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('enclosure_')) {
      let enclosureData = JSON.parse(localStorage.getItem(key));
      if (String(enclosureData.id) === targetId) {
        foundEclosure = enclosureData;
        break;
      }
    }
  }

  if (!foundEclosure) {
    alert('Вольер с таким ID не найден!');
    enclosureEditingForm.style.display = 'none';
    return;
  }

  document.getElementById('edit-enclosure-name').value = foundEclosure.name;
  document.getElementById('edit-enclosure-size').value = foundEclosure.size;
  document.getElementById('edit-enclosure-date').value = foundEclosure.date;
  document.getElementById('edit-enclosure-address').value =
    foundEclosure.address;

  enclosureEditingForm.style.display = 'block';
}

function saveEnclosureChanges() {
  let targetId = enclosureIdToEdit.value.trim();

  let updatedName = document.getElementById('edit-enclosure-name').value.trim();
  let updatedSize = document.getElementById('edit-enclosure-size').value.trim();
  let updatedDate = document.getElementById('edit-enclosure-date').value.trim();
  let updatedAddress = document
    .getElementById('edit-enclosure-address')
    .value.trim();

  if (
    updatedName === '' ||
    updatedSize === '' ||
    updatedDate === '' ||
    updatedAddress === ''
  ) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith('enclosure_')) {
      let enclosureData = JSON.parse(localStorage.getItem(key));

      if (String(enclosureData.id) === targetId) {
        let updatedData = {
          id: enclosureData.id,
          name: updatedName,
          size: updatedSize,
          date: updatedDate,
          address: updatedAddress,
        };

        localStorage.setItem(key, JSON.stringify(updatedData));
        alert('Данные вольера успешно изменены!');

        enclosureEditingForm.style.display = 'none';
        enclosureEditing.style.display = 'none';
        enclosureIdToEdit.value = '';
        displayEnclosures();
        return;
      }
    }
  }
}

function findEnclosuresForm() {
  let findForm = document.getElementById('find-enclosure-container');

  if (findForm.style.display === 'none') {
    findForm.style.display = 'block';
  } else {
    findForm.style.display = 'none';
  }
}

function renderFoundTableEnclosures(foundEnclosures, tableId) {
  const table = document.getElementById(tableId);

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  if (foundEnclosures.length === 0) {
    alert('Совпадения не найдены!');
    return;
  }

  foundEnclosures.forEach((enclosure) => {
    let row = table.insertRow();

    row.insertCell(0).innerText = enclosure.id || '-';
    row.insertCell(1).innerText = enclosure.name || '-';
    row.insertCell(2).innerText = enclosure.size || '-';
    row.insertCell(3).innerText = enclosure.date || '-';
    row.insertCell(4).innerText = enclosure.address;
  });
}


function findEnclosures(input) {
  let data = document.getElementById(input).value.trim().toLowerCase();

  if (!data) return;

  let foundEnclosures = [];

  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    if (key.startsWith('enclosure_')) {
      let enclosure = JSON.parse(localStorage.getItem(key));

      let matchName =
        enclosure.name && enclosure.name.toLowerCase().includes(data);
      let matchId = enclosure.id && enclosure.id.toString() === data;
      let matchEmail =
        enclosure.email && enclosure.size.toLowerCase().includes(data);
      let matchPhone =
        enclosure.phone && enclosure.date.toString().includes(data);
      let matchAddress =
        enclosure.address && enclosure.address.toLowerCase().includes(data);

      if (
        matchName ||
        matchId ||
        matchEmail ||
        matchPhone ||
        matchAddress
      ) {
        foundEnclosures.push(enclosure);
      }
    }
  }
  renderFoundTableEnclosures(foundEnclosures, 'found-enclosure-table');
}

window.createEnclosure = createEnclosure;
window.createNewEnclosure = createNewEnclosure;
window.deleteEnclosure = deleteEnclosure;
window.findEnclosureToDelete = findEnclosureToDelete;
window.confirmEnclosureDeletion = confirmEnclosureDeletion;
window.editEnclosure = editEnclosure;
window.findEnclosureToEdit = findEnclosureToEdit;
window.saveEnclosureChanges = saveEnclosureChanges;
window.findEnclosures = findEnclosures;
window.findEnclosuresForm = findEnclosuresForm;