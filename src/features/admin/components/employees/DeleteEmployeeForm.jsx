import { useState } from 'react';
import SimpleEmployeeTable from './SimpleEmployeeTable';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AlertDialog from '../../../../components/MuiDialog';

export default function DeleteEmployeeForm({ onDeleteSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const [notification, setNotification] = useState(null);
  const [errorText, setErrorText] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const findEmployeeToDelete = () => {

    setNotification(null);
    setErrorText('');

    if (!targetId.trim()) {
      setErrorText('Пожалуйста, введите ID сотрудника!');
      setNotification({
        text: 'Поле ID не может быть пустым',
        severity: 'error',
      });
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];
    const employee = currentEmployees.find(
      (emp) => String(emp.id) === targetId.trim(),
    );

    if (!employee) {
      setErrorText('Сотрудник не найден');
      setNotification({
        text: 'Сотрудник с таким ID не найден!',
        severity: 'error',
      });
      setIsInfoVisible(false);
      setFoundEmployee(null);
      return;
    }

    setFoundEmployee(employee);
    setIsInfoVisible(true);
  };

  const confirmEmployeeDeletion = () => {
    const savedData = localStorage.getItem('employees');
    if (!savedData) return;

    const currentEmployees = JSON.parse(savedData);
    const updatedEmployees = currentEmployees.filter(
      (emp) => String(emp.id) !== targetId.trim(),
    );

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setNotification({ text: 'Сотрудник успешно удален!', severity: 'success' });

    setIsInfoVisible(false);
    setFoundEmployee(null);
    setTargetId('');
    setErrorText('');

    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
    <>
      <Box sx={{ p: 2, maxWidth: 500 }}>
        <Typography variant="h6" gutterBottom>
          Введите ID сотрудника для его удаления
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
            label="ID Сотрудника"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            error={!!errorText}
            helperText={errorText}
            variant="standard"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={findEmployeeToDelete}
            sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
          >
            Найти
          </Button>
        </Box>
      </Box>
      {isInfoVisible && foundEmployee && (
        <>
          <Box
            className="employee-container-info"
            id="employee-deletion-info"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <SimpleEmployeeTable employees={[foundEmployee]} />

            <Button
              variant="contained"
              color="error"
              onClick={() => setIsDialogOpen(true)}
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
            >
              Удалить
            </Button>

            <AlertDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              title="Удаление сотрудника"
              message="Вы действительно хотите удалить сотрудника?"
              onAgree={confirmEmployeeDeletion}
            />
          </Box>
        </>
      )}
    </>
  );
}
