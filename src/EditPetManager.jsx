import { useState } from 'react';
import { SimplePetTable } from './AnimalManager';
import BasicSelect from './MuiSelect';
import { useEnclosures } from './UseEnclosures';

export default function EditPetManager({ onPetsUpdated }) {
  const [searchId, setSearchId] = useState('');
  const [foundPet, setFoundPet] = useState(null);
  const [activeForm, setActiveForm] = useState('');

  const [newEnclosure, setNewEnclosure] = useState('');

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const enclosuresList = useEnclosures();

  const updatePetData = (updatedFields) => {
    const currentEmployeeId = localStorage.getItem('current_user_id') || '1';
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.
        ${String(now.getMonth() + 1).padStart(2, '0')}.
        ${now.getFullYear()} 
        ${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}`;

    const saved = localStorage.getItem('pets');
    if (saved) {
      const currentPets = JSON.parse(saved);

      const updatedPets = currentPets.map((pet) => {
        if (String(pet.id) === String(foundPet.id)) {
          const updated = {
            ...pet,
            ...updatedFields,
            updateDate: formattedDate,
            updateEmployee: currentEmployeeId,
          };
          setFoundPet(updated);
          return updated;
        }
        return pet;
      });

      localStorage.setItem('pets', JSON.stringify(updatedPets));
      alert('Данные успешно обновлены!');
      setActiveForm('');

      if (onPetsUpdated) onPetsUpdated();
    }
  };

  const handleFindById = () => {
    if (!searchId.trim()) return;

    const saved = localStorage.getItem('pets');
    if (saved) {
      const currentPets = JSON.parse(saved);
      const pet = currentPets.find((p) => String(p.id) === searchId.trim());

      if (pet) {
        setFoundPet(pet);
        setActiveForm('');

        setNewEnclosure(pet.enclosure || '');
        setNewCondition(pet.conditions || '');
        setNewStatus(pet.status || '');
        setNewName(pet.name || '');
        setNewDescription(pet.description || '');
      } else {
        alert('Животного с таким ID не найдено!');
        setFoundPet(null);
      }
    } else {
      alert('База данных пуста!');
    }
  };

  const handleMoveToNewEnclosure = () => {
    if (!newEnclosure) {
      alert('Укажите новый вольер!');
      return;
    }
    updatePetData({ enclosure: newEnclosure });
  };

  const handleChangeCondition = () => {
    if (!newCondition) {
      alert('Выберите новое состояние!');
      return;
    }
    updatePetData({ conditions: newCondition });
  };

  const handleChangeStatus = () => {
    if (!newStatus) {
      alert('Укажите новый статус!');
      return;
    }
    updatePetData({ status: newStatus });
  };

  const handleChangeData = () => {
    if (newName.trim() === '' || newDescription.trim() === '') {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    if (newName.length > 50) {
      alert('Кличка слишком длинная!');
      return;
    }
    if (newDescription.length > 500) {
      alert('Описание слишком длинное!');
      return;
    }

    updatePetData({
      name: newName.trim(),
      description: newDescription.trim(),
    });
  };

  const handleDeleteAnimal = () => {
    const saved = localStorage.getItem('pets');
    if (saved) {
      const currentPets = JSON.parse(saved);
      const filteredPets = currentPets.filter(
        (pet) => String(pet.id) !== String(foundPet.id),
      );

      localStorage.setItem('pets', JSON.stringify(filteredPets));
      alert('Животное успешно удалено');

      setFoundPet(null);
      setSearchId('');
      setActiveForm('');

      if (onPetsUpdated) onPetsUpdated();
    }
  };

  const [newCondition, setNewCondition] = useState('');
  const newConditionList = [
    { id: 'Здоров(а)', name: 'Здоров(а)' },
    { id: 'Лечение', name: 'Лечение' },
    { id: 'Карантин', name: 'Карантин' },
    { id: 'Травмирован(а)', name: 'Травмирован(а)' },
    { id: 'Инвалидность', name: 'Инвалидность' },
    {
      id: 'Требуется вакцинация / Стерилизация',
      name: 'Требуется вакцинация / Стерилизация',
    },
  ];

  const [newStatus, setNewStatus] = useState('');
  const newStatusList = [
    { id: 'Поступил', name: 'Поступил' },
    { id: 'Ищет дом', name: 'Ищет дом' },
    { id: 'Пристроен', name: 'Пристроен' },
  ];


  return (
    <div
      id="find-pet-by-id-container"
      className="pet-container"
      style={{ margin: '10px 10px 10px 5px' }}
    >
      <label>
        Введите ID животного, чьи данные хотите отредактировать: <br />
        <input
          type="text"
          placeholder="ID животного"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={{ marginRight: '5px', padding: '4px' }}
        />
      </label>
      <button id="find-pet-by-id-btn" onClick={handleFindById}>
        Найти
      </button>

      {foundPet && (
        <>
          <div style={{ marginTop: '15px' }}>
            <SimplePetTable pets={[foundPet]} />
          </div>

          <div
            id="pet-edit-btns"
            className="pet-container"
            style={{ marginTop: '15px' }}
          >
            <button
              className="pet-btn"
              onClick={() =>
                setActiveForm(activeForm === 'enclosure' ? '' : 'enclosure')
              }
            >
              Переместить в другой вольер
            </button>
            <button
              className="pet-btn"
              onClick={() =>
                setActiveForm(activeForm === 'condition' ? '' : 'condition')
              }
            >
              Изменить состояние
            </button>
            <button
              className="pet-btn"
              onClick={() =>
                setActiveForm(activeForm === 'status' ? '' : 'status')
              }
            >
              Смена статуса
            </button>
            <button
              className="pet-btn"
              onClick={() => setActiveForm(activeForm === 'data' ? '' : 'data')}
            >
              Изменить данные
            </button>
            <button
              className="pet-btn"
              onClick={() =>
                setActiveForm(activeForm === 'delete' ? '' : 'delete')
              }
            >
              Удалить животное
            </button>
          </div>

          {activeForm === 'enclosure' && (
            <div
              id="pet-change-enclosure"
              className="pet-container"
              style={{ marginTop: '10px' }}
            >
              <label>
                Выберите новый вольер <br />
                <BasicSelect
                  label="Вольер"
                  options={enclosuresList}
                  value={newEnclosure}
                  onChange={(e) => setNewEnclosure(e.target.value)}
                />
                <br />
                <button onClick={handleMoveToNewEnclosure}>
                  Сохранить изменения
                </button>
              </label>
            </div>
          )}

          {activeForm === 'condition' && (
            <div
              id="pet-change-condition"
              className="pet-container"
              style={{ marginTop: '10px' }}
            >
              <label>
                Укажите новое состояние <br />
                <BasicSelect
                  label="Состояние"
                  options={newConditionList}
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                />
                <br />
                <button onClick={handleChangeCondition}>
                  Сохранить изменения
                </button>
              </label>
            </div>
          )}

          {activeForm === 'status' && (
            <div
              id="pet-change-status"
              className="pet-container"
              style={{ marginTop: '10px' }}
            >
              <label>
                Укажите новый статус животного <br />
                <BasicSelect
                  label="Статус"
                  options={newStatusList}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
                <br />
                <button onClick={handleChangeStatus}>
                  Сохранить изменения
                </button>
              </label>
            </div>
          )}

          {activeForm === 'data' && (
            <div
              id="pet-change-data"
              className="pet-container"
              style={{ marginTop: '10px' }}
            >
              <label>
                {' '}
                Укажите новое имя для животного <br />
                <input
                  type="text"
                  placeholder="Кличка"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    margin: '0 5px 5px 0',
                    width: '250px',
                    boxSizing: 'border-box',
                  }}
                />{' '}
                <br />
              </label>
              <label>
                {' '}
                Введите новое описание животного <br />
                <textarea
                  placeholder="Введите описание"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={{
                    width: '250px',
                    height: '60px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    marginBottom: '5px',
                  }}
                ></textarea>{' '}
                <br />
              </label>
              <button onClick={handleChangeData}>Сохранить изменения</button>
            </div>
          )}

          {activeForm === 'delete' && (
            <div
              id="delete-pet"
              className="pet-container"
              style={{ margin: '10px 0' }}
            >
              <label>
                Подтвердите удаление животного из базы данных <br />
                <button
                  onClick={handleDeleteAnimal}
                  style={{
                    backgroundColor: '#ff4d4d',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    marginTop: '5px',
                  }}
                >
                  Удалить окончательно
                </button>
              </label>
            </div>
          )}
        </>
      )}
    </div>
  );
}
