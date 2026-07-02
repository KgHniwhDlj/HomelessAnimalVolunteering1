import { useState, useEffect } from 'react';
import BasicSelect from '../../../components/MuiSelect';
import { useEnclosures } from '../../../hooks/UseEnclosures';
import SimplePetTable from './SimplePetTable';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AlertDialog from '../../../components/MuiDialog';

export default function EditPetManager({ onPetsUpdated }) {
  const [searchId, setSearchId] = useState('');
  const [foundPet, setFoundPet] = useState(null);
  const [activeForm, setActiveForm] = useState('');

  const [newEnclosure, setNewEnclosure] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const enclosuresList = useEnclosures();

  const [notification, setNotification] = useState(null);
  const [newError, setNewError] = useState({});

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const updatePetData = (updatedFields) => {
    const currentEmployeeId = localStorage.getItem('current_user_id') || '1';
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

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
      setNotification({ type: 'success', text: 'Данные успешно обновлены!' });
      setActiveForm('');
      setNewError({});

      if (onPetsUpdated) onPetsUpdated();
    }
  };

  const handleFindById = () => {
    if (!searchId.trim()) {
      setNewError({ searchId: 'Введите ID для поиска' });
      return;
    }

    const saved = localStorage.getItem('pets');
    if (saved) {
      const currentPets = JSON.parse(saved);
      const pet = currentPets.find((p) => String(p.id) === searchId.trim());

      if (pet) {
        setFoundPet(pet);
        setActiveForm('');
        setNewError({});
        setNewEnclosure(pet.enclosure || '');
        setNewCondition(pet.conditions || '');
        setNewStatus(pet.status || '');
        setNewName(pet.name || '');
        setNewDescription(pet.description || '');
      } else {
        setNotification({ type: 'error', text: 'Животного с таким ID не найдено!' });
        setFoundPet(null);
      }
    } else {
      setNotification({ type: 'error', text: 'База данных пуста!' });
    }
  };

  const handleMoveToNewEnclosure = () => {
    if (!newEnclosure) {
      setNotification({ type: 'error', text: 'Укажите новый вольер!' });
      return;
    }
    updatePetData({ enclosure: newEnclosure });
  };

  const handleChangeCondition = () => {
    if (!newCondition) {
      setNotification({ type: 'error', text: 'Выберите новое состояние!' });
      return;
    }
    updatePetData({ conditions: newCondition });
  };

  const handleChangeStatus = () => {
    if (!newStatus) {
      setNotification({ type: 'error', text: 'Укажите новый статус!' });
      return;
    }
    updatePetData({ status: newStatus });
  };

  const handleChangeData = () => {
    const errors = {};

    if (newName.trim() === '') {
      errors.name = 'Кличка не может быть пустой';
    } else if (newName.length > 50) {
      errors.name = 'Кличка слишком длинная! (Макс. 50 символов)';
    }

    if (newDescription.trim() === '') {
      errors.description = 'Описание не может быть пустым';
    } else if (newDescription.length > 500) {
      errors.description = 'Описание слишком длинное! (Макс. 500 символов)';
    }

    if (Object.keys(errors).length > 0) {
      setNewError(errors);
      setNotification({ type: 'error', text: 'Пожалуйста, исправьте ошибки в полях.' });
      return;
    }

    setNewError({});
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
      setNotification({ type: 'success', text: 'Животное успешно удалено' });

      setFoundPet(null);
      setSearchId('');
      setActiveForm('');
      setNewError({});

      if (onPetsUpdated) onPetsUpdated();
    }
  };

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

  const newStatusList = [
    { id: 'Поступил', name: 'Поступил' },
    { id: 'Ищет дом', name: 'Ищет дом' },
    { id: 'Пристроен', name: 'Пристроен' },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {notification && (
        <Box sx={{ mb: '15px' }}>
          <Alert
            icon={
              notification.type === 'success' ? (
                <CheckIcon fontSize="inherit" />
              ) : undefined
            }
            severity={notification.type}
          >
            {notification.text}
          </Alert>
        </Box>
      )}

      <Typography variant="h6" gutterBottom>
        Введите ID животного, чьи данные хотите отредактировать:
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TextField
          label="ID животного"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            if (newError.searchId)
              setNewError((prev) => ({ ...prev, searchId: '' }));
          }}
          error={!!newError.searchId}
          helperText={newError.searchId}
          variant="standard"
        />
        <Button
          variant="contained"
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
          onClick={handleFindById}
        >
          Найти
        </Button>
      </Box>

      {foundPet && (
        <>
          <Box sx={{ mt: '10px' }}>
            <SimplePetTable pets={[foundPet]} />
          </Box>

          <Box sx={{ mt: '15px' }}>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: '#3e332e',
                color: '#ffdfdf',
              }}
              onClick={() => {
                setActiveForm(activeForm === 'enclosure' ? '' : 'enclosure');
                setNewError({});
              }}
            >
              Переместить в другой вольер
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: '#3e332e',
                color: '#ffdfdf',
              }}
              onClick={() => {
                setActiveForm(activeForm === 'condition' ? '' : 'condition');
                setNewError({});
              }}
            >
              Изменить состояние
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: '#3e332e',
                color: '#ffdfdf',
              }}
              className="pet-btn"
              onClick={() => {
                setActiveForm(activeForm === 'status' ? '' : 'status');
                setNewError({});
              }}
            >
              Смена статуса
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: '#3e332e',
                color: '#ffdfdf',
              }}
              className="pet-btn"
              onClick={() => {
                setActiveForm(activeForm === 'data' ? '' : 'data');
                setNewError({});
              }}
            >
              Изменить данные
            </Button>
            <Button
              variant="contained"
              sx={{
                mt: 1,
                mr: 1,
                backgroundColor: '#3e332e',
                color: '#ffdfdf',
              }}
              className="pet-btn"
              onClick={() => {
                setActiveForm(activeForm === 'delete' ? '' : 'delete');
                setNewError({});
              }}
            >
              Удалить животное
            </Button>
          </Box>

          {activeForm === 'enclosure' && (
            <Box sx={{ mt: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Выберите новый вольер
              </Typography>
              <BasicSelect
                label="Вольер"
                options={enclosuresList}
                value={newEnclosure}
                onChange={(e) => setNewEnclosure(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  mr: 1,
                  backgroundColor: '#3e332e',
                  color: '#ffdfdf',
                }}
                onClick={handleMoveToNewEnclosure}
              >
                Сохранить изменения
              </Button>
            </Box>
          )}

          {activeForm === 'condition' && (
            <Box
              id="pet-change-condition"
              className="pet-container"
              sx={{ mt: '10px' }}
            >
              <Typography variant="h6" gutterBottom>
                Укажите новое состояние{' '}
              </Typography>
              <BasicSelect
                label="Состояние"
                options={newConditionList}
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  mr: 1,
                  backgroundColor: '#3e332e',
                  color: '#ffdfdf',
                }}
                onClick={handleChangeCondition}
              >
                Сохранить изменения
              </Button>
            </Box>
          )}

          {activeForm === 'status' && (
            <Box sx={{ mt: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Укажите новый статус животного{' '}
              </Typography>
              <BasicSelect
                label="Статус"
                options={newStatusList}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              />

              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  mr: 1,
                  backgroundColor: '#3e332e',
                  color: '#ffdfdf',
                }}
                onClick={handleChangeStatus}
              >
                Сохранить изменения
              </Button>
            </Box>
          )}

          {activeForm === 'data' && (
            <Box sx={{ mt: '10px', maxWidth: 400 }}>
              <Typography variant="h6" gutterBottom>
                Укажите новое имя для животного{' '}
              </Typography>
              <TextField
                label="Кличка"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (newError.name)
                    setNewError((prev) => ({ ...prev, name: '' }));
                }}
                error={!!newError.name}
                helperText={newError.name}
                style={{
                  marginTop: '10px',
                  marginBottom: '5px',
                }}
                fullWidth
              />
              <Typography variant="h6" gutterBottom>
                Новое описание животного
              </Typography>
              <TextField
                label="Описание"
                placeholder="Описание"
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value);
                  if (newError.description)
                    setNewError((prev) => ({ ...prev, description: '' }));
                }}
                error={!!newError.description}
                helperText={newError.description}
                multiline
                rows={4}
                sx={{
                  mt: '10px',
                  mb: '5px',
                }}
                fullWidth
              />
              <Button
                variant="contained"
                sx={{
                  mt: 1,
                  mr: 1,
                  backgroundColor: '#3e332e',
                  color: '#ffdfdf',
                }}
                onClick={handleChangeData}
              >
                Сохранить изменения
              </Button>
            </Box>
          )}

          {activeForm === 'delete' && (
            <Box sx={{ mt: '10px' }}>
              <Typography variant="h6" gutterBottom>
                Подтвердите удаление животного из базы данных{' '}
              </Typography>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="contained"
                sx={{
                  mt: 1,
                  mr: 1,
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#fb7676',
                  },
                  '&:active': {
                    backgroundColor: '#8e0c0c',
                  },
                }}
              >
                Удалить окончательно
              </Button>

              <AlertDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title="Удаление животного"
                message="Вы действительно хотите удалить выбранное животное?"
                onAgree={handleDeleteAnimal}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}