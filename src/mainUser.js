

function openForm(closedForm) {
    let form = document.getElementById(closedForm);
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function fillEnclosureSelects() {
    const createSelect = document.getElementById('pet-enclosure');
    const editSelect = document.getElementById('pet-new-enclosure');

    let enclosures = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith('enclosure_')) {
            let data = localStorage.getItem(key);
            let enclosureObj = JSON.parse(data);
            enclosures.push(enclosureObj.name || enclosureObj.id);

        }
    }

    if (enclosures.length === 0) {
        enclosures = ["Вольер 2", "Вольер 3"];
    }

    enclosures.sort();

    const updateSelect = (selectElement, defaultText) => {
        if (!selectElement) return;

        selectElement.innerHTML = `<option>${defaultText}</option>`;

        enclosures.forEach(enclosureName => {
            let option = document.createElement('option');
            option.value = enclosureName;
            option.innerText = enclosureName;
            selectElement.appendChild(option);
        });
    };

    updateSelect(createSelect, "Укажите вольер...");
    updateSelect(editSelect, "Укажите вольер...");
}



function displayAnimal() {
    let animalTable = document.getElementById('pet-main-table');

    if (!animalTable) return;

    animalTable.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Кличка</th>
            <th>Вид</th>
            <th>Вольер</th>
            <th>Состояние</th>
            <th>Статус</th>
            <th>Дата добавления</th>
            <th>Добавил(а)</th>
            <th>Дата последнего изменения</th>
            <th>Изменил(а)</th>
            <th>Описание</th>
        </tr>
  `;

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith('animal_')) {
            let animalData = JSON.parse(localStorage.getItem(key));
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${animalData.id}</td>
                <td>${animalData.name}</td>
                <td>${animalData.species}</td>
                <td>${animalData.enclosure}</td>
                <td>${animalData.conditions}</td>
                <td>${animalData.status}</td>
                <td>${animalData.addDate}</td>
                <td>${animalData.addEmployee}</td>
                <td>${animalData.updateDate}</td>
                <td>${animalData.updateEmployee}</td>
                <td>${animalData.description}</td>
            `;

            animalTable.appendChild(row);
        }
    }
}

function createNewAnimal() {
  let currentEmployeeId =
    localStorage.getItem('current_user_id')  || '1';

  let newAnimalName = document.getElementById('pet-name').value.trim();
  let newAnimalSpecies = document.getElementById('pet-species').value;
  let newAnimalEnclosure = document.getElementById('pet-enclosure').value;
  let newAnimalCondition = document.getElementById('pet-condition').value;
  let newAnimalStatus = document.getElementById('pet-status').value;
  let newAnimalDescription = document.getElementById('pet-description').value;

  let newAnimalID = Date.now();

  if (
    newAnimalName === '' ||
    newAnimalSpecies.includes('Выберите') ||
    newAnimalEnclosure.includes('Укажите') ||
    newAnimalCondition.includes('Укажите') ||
    newAnimalStatus.includes('Укажите') ||
    newAnimalDescription === ''
  ) {
    alert('Пожалуйста, заполните все поля');
    return;
  }
  if (newAnimalDescription.length > 500) {
    alert('Описание слишком длинное!');
    return;
  }
  if (newAnimalName.length > 50) {
    alert('Кличка слишком длинная!');
    return;
  }

  let now = new Date();
  let day = String(now.getDate()).padStart(2, '0');
  let month = String(now.getMonth() + 1).padStart(2, '0');
  let year = now.getFullYear();
  let hours = String(now.getHours()).padStart(2, '0');
  let minutes = String(now.getMinutes()).padStart(2, '0');

  let formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

  let animalData = {
    id: newAnimalID,
    name: newAnimalName,
    species: newAnimalSpecies,
    enclosure: newAnimalEnclosure,
    conditions: newAnimalCondition,
    status: newAnimalStatus,
    addDate: formattedDate,
    addEmployee: currentEmployeeId,
    updateDate: formattedDate,
    updateEmployee: currentEmployeeId,
    description: newAnimalDescription,
  };

  localStorage.setItem('animal_' + newAnimalID, JSON.stringify(animalData));

  document.getElementById('pet-name').value = '';
  document.getElementById('pet-description').value = '';

  openForm('create-new-pet');
  displayAnimal();
}

function renderFoundTable(foundAnimals, tableId) {
    const table = document.getElementById(tableId);

    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    if (foundAnimals.length === 0) {
        alert('Совпадения не найдены!');
        return;
    }

    foundAnimals.forEach(animal => {
        let row = table.insertRow();

        let creatorName = getEmployeeName(animal.addEmployee);
        let updaterName = getEmployeeName(animal.updateEmployee);

        row.insertCell(0).innerText = animal.id || '-';
        row.insertCell(1).innerText = animal.name || '-';
        row.insertCell(2).innerText = animal.species || '-';
        row.insertCell(3).innerText = animal.enclosure || '-';
        row.insertCell(4).innerText = animal.conditions || '-';
        row.insertCell(5).innerText = animal.status || '-';
        row.insertCell(6).innerText = animal.addDate || '-';
        row.insertCell(7).innerText = creatorName;
        row.insertCell(8).innerText = animal.updateDate || '-';
        row.insertCell(9).innerText = updaterName;
        row.insertCell(10).innerText = animal.description || '-';
    });
}

function getEmployeeName(employeeId) {
    if (!employeeId) return '-';

    const key = `employee_${employeeId}`;
    const employeeData = localStorage.getItem(key);

    if (employeeData) {
        try {
            const employee = JSON.parse(employeeData);
            return employee.name || `Сотрудник №${employeeId}`;
        } catch (e) {
            return `Сотрудник №${employeeId}`;
        }
    }

    return `ID: ${employeeId}`;
}


function findAnimal(input) {
    let data = document.getElementById(input).value.trim().toLowerCase();
    const table = document.getElementById('found-pet-table');

    if (!data) return;

    let foundAnimals = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith('animal_')) {
          let animal = JSON.parse(localStorage.getItem(key));

          let matchName = animal.name && animal.name.toLowerCase().includes(data);
          let matchId = animal.id && animal.id.toString() === data;
          let matchSpecies = animal.species && animal.species.toLowerCase().includes(data);
          let matchEnclosure = animal.enclosure && animal.enclosure.toString().includes(data);
          let matchCondition = animal.conditions && animal.conditions.toLowerCase().includes(data);
          let matchStatus = animal.status && animal.status.toLowerCase().includes(data);
          let matchAddDate = animal.addDate && animal.addDate.toLowerCase().includes(data);
          let matchUpdateDate = animal.updateDate && animal.updateDate.toLowerCase().includes(data);
          let matchDescription = animal.description && animal.description.toLowerCase().includes(data);

          let creatorName = getEmployeeName(animal.addEmployee).toLowerCase();
          let updaterName = getEmployeeName(animal.updateEmployee,).toLowerCase();
          let matchAddEmployee = creatorName.includes(data);
          let matchUpdateEmployee = updaterName.includes(data);


          if (matchName || matchId || matchSpecies || matchEnclosure || matchCondition || matchStatus ||
            matchAddDate || matchDescription || matchAddEmployee || matchUpdateEmployee || matchUpdateDate) {
            foundAnimals.push(animal);
          }
        }
    }
    renderFoundTable(foundAnimals, 'found-pet-table');
}

let animalId = null;

function findAnimalById(input) {
    animalId = document.getElementById(input).value.trim().toLowerCase();

      if (!animalId) return;

      let foundAnimals = [];

      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key.startsWith('animal_')) {
          let animal = JSON.parse(localStorage.getItem(key));

          let matchId = animal.id && animal.id.toString() === animalId;

          if (matchId) {
            foundAnimals.push(animal);
          }
        }
      }
      renderFoundTable(foundAnimals, 'found-pet-by-id-table');
    let form = document.getElementById('pet-edit-btns');
    if (form.style.display === 'none') {
      form.style.display = 'block';
    }
      return animalId;
}

function moveToNewEnclosure() {
    let newPetEnclosure = document.getElementById('pet-new-enclosure').value;

    if (newPetEnclosure.includes('Укажите')) {
        alert("Укажите новый вольер!");
        return;
    }

    let currentEmployeeId = localStorage.getItem('current_user_id')  || '1';

    let now = new Date();
    let formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let keyAnimal = `animal_${animalId}`;
    let animalData = localStorage.getItem(keyAnimal);

    if (animalData) {
        let animal = JSON.parse(animalData);

        animal.enclosure = newPetEnclosure;
        animal.updateEmployee = currentEmployeeId;
        animal.updateDate = formattedDate;

        localStorage.setItem(keyAnimal, JSON.stringify(animal));

        let foundAnimals = [];
        let matchId = animal.id && animal.id.toString() === animalId;
        if (matchId) {
          foundAnimals.push(animal);
        }

        alert("Данные успешно обновлены!")
        displayAnimal();
        renderFoundTable(foundAnimals, 'found-pet-by-id-table');
    } else {
        alert("Животного с таким ID не найдено!")
    }
}

function changeCondition() {
    let newPetCondition = document.getElementById('pet-new-condition').value;

    if (newPetCondition.includes('Укажите')) {
        alert("Выберите новое состояние!");
        return;
    }
    let currentEmployeeId = localStorage.getItem('current_user_id') || '1';

    let now = new Date();
    let formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let keyAnimal = `animal_${animalId}`;
    let animalData = localStorage.getItem(keyAnimal);

    if (animalData) {
        let animal = JSON.parse(localStorage.getItem(keyAnimal));

        animal.conditions = newPetCondition;
        animal.updateEmployee = currentEmployeeId;
        animal.updateDate = formattedDate;

        localStorage.setItem(keyAnimal, JSON.stringify(animal));

        let foundAnimals = [];
        let matchId = animal.id && animal.id.toString() === animalId;
        if (matchId) {
          foundAnimals.push(animal);
        }

        alert('Данные успешно обновлены!');
        displayAnimal();
        renderFoundTable(foundAnimals, 'found-pet-by-id-table');
    } else {
      alert('Животного с таким ID не найдено!');
    }
}

function changeStatus() {
    let newPetStatus = document.getElementById('pet-new-status').value;

    if (newPetStatus.includes('Укажите')) {
        alert("Укажите новое состояние");
        return;
    }
    let currentEmployeeId = localStorage.getItem('current_user_id') || '1';
    let now = new Date();
    let formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let keyAnimal = `animal_${animalId}`;
    let animalData = localStorage.getItem(keyAnimal);

    if (animalData) {
        let animal = JSON.parse(animalData);

        animal.status = newPetStatus;
        animal.updateEmployee = currentEmployeeId;
        animal.updateDate = formattedDate;

        localStorage.setItem(keyAnimal, JSON.stringify(animal));

        let foundAnimals = [];
        let matchId = animal.id && animal.id.toString() === animalId;
        if (matchId) {
          foundAnimals.push(animal);
        }

        alert('Данные успешно обновлены!');
        displayAnimal();
        renderFoundTable(foundAnimals, 'found-pet-by-id-table');
    } else {
        alert("Животного с таким ID не найдено!");
        }
}

function changeData() {
    let newPetName = document.getElementById('pet-new-name').value;
    let newPetDescription = document.getElementById('pet-new-description').value;

    let currentEmployeeId = localStorage.getItem('current_user_id' || '1');
    let now = new Date();
    let formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let keyAnimal = `animal_${animalId}`;
    let animalData = localStorage.getItem(keyAnimal);

    if (animalData) {
      let animal = JSON.parse(localStorage.getItem(keyAnimal));

      animal.name = newPetName;
      animal.description = newPetDescription;
      animal.updateEmployee = currentEmployeeId;
      animal.updateDate = formattedDate;

      localStorage.setItem(keyAnimal, JSON.stringify(animal));

      let foundAnimals = [];
      let matchId = animal.id && animal.id.toString() === animalId;
      if (matchId) {
          foundAnimals.push(animal);
      }

      alert('Данные успешно обновлены!');
      displayAnimal();
      renderFoundTable(foundAnimals, 'found-pet-by-id-table');
    } else {
      alert('Животного с таким ID не найдено!');
    }

}

function deleteAnimal() {
    let keyAnimal = `animal_${animalId}`;
    localStorage.removeItem(keyAnimal);
    alert("Животное успешно удалено");
    displayAnimal();
}

window.moveToNewEnclosure = moveToNewEnclosure;
window.changeCondition = changeCondition;
window.changeStatus = changeStatus;
window.changeData = changeData;
window.deleteAnimal = deleteAnimal;
window.findAnimalById = findAnimalById;
window.createNewAnimal = createNewAnimal;
window.findAnimal = findAnimal;
window.openForm = openForm;
document.addEventListener('DOMContentLoaded', () => {
  displayAnimal();
  fillEnclosureSelects();
});
