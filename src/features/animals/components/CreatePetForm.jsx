import BasicSelect from '../../../components/MuiSelect';
import { useState } from 'react';
import { useEnclosures } from '../../../hooks/UseEnclosures';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function CreatePetForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [enclosure, setEnclosure] = useState('');
  const [description, setDescription] = useState('');

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const fieldStyle = {
    width: '250px',
    boxSizing: 'border-box',
    marginBottom: '5px',
  };

  const enclosuresList = useEnclosures();

  const createNewAnimal = () => {
    let currentEmployeeId = localStorage.getItem('current_user_id') || '1';

    setNotification(null);
    const newErrors = {};


    if (!name.trim()) newErrors.name = 'Пожалуйста, заполните кличку';
    if (!species) newErrors.species = 'Пожалуйста, заполните вид';
    if (!enclosure) newErrors.enclosure = 'Пожалуйста, заполните вольер';
    if (!condition) newErrors.condition = 'Пожалуйста, заполните состояние';
    if (!status) newErrors.status = 'Пожалуйста, заполните статус';
    if (!description.trim()) newErrors.description = 'Пожалуйста, заполните описание';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error',
      });
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

    setNotification({
      text: 'Сотрудник успешно добавлен!',
      severity: 'success',
    });
    setErrors({});

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
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Введите данные нового питомца
      </Typography>

      {notification && (
        <Alert
          severity={notification.severity}
          icon={
            notification.severity === 'success' ? (
              <CheckIcon fontSize="inherit" />
            ) : undefined
          }
          sx={{ mb: 2 }}
        >
          {notification.text}
        </Alert>
      )}
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
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
        <Button
          variant="contained"
          color="primary"
          onClick={createNewAnimal}
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
        >
          Зарегистрировать животное
        </Button>
      </Box>
    </Box>
  );
}
