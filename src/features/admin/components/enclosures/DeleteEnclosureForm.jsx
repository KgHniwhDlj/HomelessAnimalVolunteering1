import { useState } from 'react';
import SimpleEnclosureTable from './SimpleEnclosureTable';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AlertDialog from '../../../../components/MuiDialog';

export default function DeleteEnclosureForm({ onDeleteSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [foundEnclosure, setFoundEnclosure] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const [notification, setNotification] = useState(null);
  const [errorText, setErrorText] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const findEnclosureToDelete = () => {
    setNotification(null);
    setErrorText('');

    if (!targetId.trim()) {
      setErrorText('Пожалуйста, введите ID вольера!');
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
      setErrorText('Вольер не найден');
      setNotification({
        text: 'Вольер с таким ID не найден!',
        severity: 'error',
      });
      setIsInfoVisible(false);
      setFoundEnclosure(null);
      return;
    }

    setFoundEnclosure(enclosure);
    setIsInfoVisible(true);
  };

  const confirmEnclosureDeletion = () => {
    const savedData = localStorage.getItem('enclosures');
    if (!savedData) return;

    const currentEnclosures = JSON.parse(savedData);
    const updatedEnclosures = currentEnclosures.filter(
      (enc) => String(enc.id) !== targetId.trim(),
    );

    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));

    setNotification({ text: 'Вольер успешно удален!', severity: 'success' });

    setIsInfoVisible(false);
    setFoundEnclosure(null);
    setTargetId('');
    setErrorText('');

    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Введите ID вольера для его удаления
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
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          mb: 3,
          maxWidth: 500,
        }}
      >
        <TextField
          label="ID Вольера"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          error={!!errorText}
          helperText={errorText}
          variant="standard"
          fullWidth
        />
        <Button
          variant="contained"
          onClick={findEnclosureToDelete}
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
        >
          Найти
        </Button>
      </Box>

      {isInfoVisible && foundEnclosure && (
        <Box
          className="enclosure-container-info"
          id="enclosure-deletion-info"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <SimpleEnclosureTable enclosures={[foundEnclosure]} />

          <Button
            variant="contained"
            color="error"
            sx={{
              backgroundColor: '#ff4d4d',
              color: 'white',
              '&:hover': {
                backgroundColor: '#fb7676',
              },
              '&:active': {
                backgroundColor: '#8e0c0c',
              },
            }}
            onClick={() => setIsDialogOpen(true)}
          >
            Удалить
          </Button>

          <AlertDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Удаление вольера"
            message="Вы действительно хотите удалить вольер?"
            onAgree={confirmEnclosureDeletion}
          />
        </Box>
      )}
    </Box>
  );
}
