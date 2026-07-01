import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function CreateEnclosureForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const createNewEnclosure = () => {
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
    const currentEnclosures = savedData ? JSON.parse(savedData) : [];

    const enclosureID = Date.now();
    const newEnclosureData = {
      id: enclosureID,
      name: name.trim(),
      size: size.trim(),
      date: date.trim(),
      address: address.trim(),
    };

    const updatedEnclosures = [...currentEnclosures, newEnclosureData];
    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));

    setNotification({ text: 'Вольер успешно добавлен!', severity: 'success' });
    setErrors({});

    setName('');
    setSize('');
    setDate('');
    setAddress('');

    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Введите данные нового вольера
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
          onClick={createNewEnclosure}
          sx={{ mt: 1 }}
        >
          Добавить вольер
        </Button>
      </Box>
    </Box>
  );
}
