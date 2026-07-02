import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function EditEnclosureForm({ onEditSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const findEnclosureToEdit = () => {
    setNotification(null);
    setErrors({});

    if (!targetId.trim()) {
      setErrors({ targetId: 'Пожалуйста, введите ID вольера!' });
      setNotification({
        text: 'Поле ID не может быть пустым',
        severity: 'error',
      });
      return;
    }

    const savedData = localStorage.getItem('enclosures');
    const currentEnclosures = savedData ? JSON.parse(savedData) : [];

    const enclosure = currentEnclosures.find(
      (enc) => String(enc.id) === targetId.trim(),
    );

    if (!enclosure) {
      setErrors({ targetId: 'Вольер не найден' });
      setNotification({
        text: 'Вольер с таким ID не найден!',
        severity: 'error',
      });
      setIsFormVisible(false);
      return;
    }

    setName(enclosure.name);
    setSize(enclosure.size);
    setDate(enclosure.date);
    setAddress(enclosure.address);

    setIsFormVisible(true);
  };

  const saveEnclosureChanges = () => {
    setNotification(null);
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Пожалуйста, заполните название';
    if (!size.trim()) newErrors.size = 'Пожалуйста, укажите размер';
    if (!date.trim()) newErrors.date = 'Пожалуйста, выберите дату';
    if (!address.trim()) newErrors.address = 'Пожалуйста, укажите адрес';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error',
      });
      return;
    }

    const savedData = localStorage.getItem('enclosures');
    if (!savedData) return;

    const currentEnclosures = JSON.parse(savedData);

    const updatedEnclosures = currentEnclosures.map((enc) => {
      if (String(enc.id) === targetId.trim()) {
        return {
          id: enc.id,
          name: name.trim(),
          size: size.trim(),
          date: date,
          address: address.trim(),
        };
      }
      return enc;
    });

    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));

    setNotification({
      text: 'Данные вольера успешно изменены!',
      severity: 'success',
    });
    setErrors({});
    setIsFormVisible(false);
    setTargetId('');

    if (onEditSuccess) onEditSuccess();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 500 }}>
      <Typography variant="h6" gutterBottom>
        Введите ID вольера, чьи данные хотите отредактировать
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

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
        <TextField
          label="ID Вольера"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          error={!!errors.targetId}
          helperText={errors.targetId}
          variant="standard"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={findEnclosureToEdit}
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
        >
          Найти
        </Button>
      </Box>

      {isFormVisible && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Введите новые данные о вольере
          </Typography>

          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Размер"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              error={!!errors.size}
              helperText={errors.size}
              fullWidth
            />

            <TextField
              type="date"
              label="Дата"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={!!errors.date}
              helperText={errors.date}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            <TextField
              label="Адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              onClick={saveEnclosureChanges}
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
