import BasicSelect from '../../../components/MuiSelect';
import { useState } from 'react';
import { useEnclosures } from '../../../hooks/UseEnclosures';
import { TextField } from '@mui/material';

export default function CreatePetForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [enclosure, setEnclosure] = useState('');
  const [description, setDescription] = useState('');

  const fieldStyle = {
    width: '250px',
    boxSizing: 'border-box',
    marginBottom: '5px',
  };

  const enclosuresList = useEnclosures();

  const createNewAnimal = () => {
    let currentEmployeeId = localStorage.getItem('current_user_id') || '1';

    if (
      !name.trim() ||
      !species ||
      !enclosure ||
      !condition ||
      !status ||
      !description.trim()
    ) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    if (description.length > 500) {
      alert('Описание слишком длинное!');
      return;
    }
    if (name.length > 50) {
      alert('Кличка слишком длинная!');
      return;
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

    const newAnimalID = Date.now();
    const animalData = {
      id: newAnimalID,
      name: name.trim(),
      species: species,
      enclosure: enclosure,
      conditions: condition,
      status: status,
      addDate: formattedDate,
      addEmployee: currentEmployeeId,
      updateDate: formattedDate,
      updateEmployee: currentEmployeeId,
      description: description.trim(),
    };

    const savedPets = localStorage.getItem('pets');
    const currentPets = savedPets ? JSON.parse(savedPets) : [];
    localStorage.setItem('pets', JSON.stringify([...currentPets, animalData]));

    alert('Питомец успешно добавлен!');
    setName('');
    setDescription('');
    setSpecies('');
    setEnclosure('');
    setCondition('');
    setStatus('');

    if (onSuccess) onSuccess();
  };

  const [condition, setCondition] = useState('');
  const conditionList = [
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

  const [status, setStatus] = useState('');
  const statusList = [
    { id: 'Поступил', name: 'Поступил' },
    { id: 'Ищет дом', name: 'Ищет дом' },
    { id: 'Пристроен', name: 'Пристроен' },
  ];

  const [species, setSpecies] = useState('');
  const speciesList = [
    { id: 'Птица', name: 'Птица' },
    { id: 'Собака', name: 'Собака' },
    { id: 'Кошка', name: 'Кошка' },
    { id: 'Кролик', name: 'Кролик' },
    { id: 'Хомяк', name: 'Хомяк' },
    { id: 'Крыса', name: 'Крыса' },
    { id: 'Морская свинка', name: 'Морская свинка' },
    { id: 'Другое', name: 'Другое' },
  ];

  return (
    <div id="create-new-pet-form" style={{ margin: '10px 10px 10px 5px' }}>
      <h3>Введите данные нового питомца</h3>

      <TextField
        label="Кличка"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <BasicSelect
        label="Вид"
        options={speciesList}
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
      />
      <BasicSelect
        label="Вольер"
        options={enclosuresList}
        value={enclosure}
        onChange={(e) => setEnclosure(e.target.value)}
      />
      <BasicSelect
        label="Состояние"
        options={conditionList}
        value={condition}
        onChange={(e) => setCondition(e.target.value)}
      />
      <BasicSelect
        label="Статус"
        options={statusList}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <TextField
        label="Описание"
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        style={{
          marginTop: '8px',
        }}
      />
      <br />

      <button onClick={createNewAnimal} style={{ margin: '5px 5px 5px 0' }}>
        Зарегистрировать животное
      </button>
    </div>
  );
}
