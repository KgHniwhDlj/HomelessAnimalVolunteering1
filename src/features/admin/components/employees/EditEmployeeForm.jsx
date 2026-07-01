import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function EditEmployeeForm({ onEditSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const findEmployeeToEdit = () => {
    setNotification(null);
    setErrors({});

    if (!targetId.trim()) {
      setErrors({ targetId: 'Пожалуйста, введите ID сотрудника!' });
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
      setErrors({ targetId: 'Сотрудник не найден' });
      setNotification({
        text: 'Сотрудник с таким ID не найден!',
        severity: 'error',
      });
      setIsFormVisible(false);
      return;
    }

    setName(employee.name);
    setEmail(employee.email);
    setPhone(employee.phone);
    setAddress(employee.address);
    setPassword(employee.password);
    setRole(employee.role);

    setIsFormVisible(true);
  };

  const saveEmployeeChanges = () => {
    setNotification(null);
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Пожалуйста, заполните ФИО';
    if (!email.trim()) newErrors.email = 'Пожалуйста, заполните Email';
    if (!phone.trim()) newErrors.phone = 'Пожалуйста, заполните телефон';
    if (!address.trim()) newErrors.address = 'Пожалуйста, заполните адрес';
    if (!password.trim()) newErrors.password = 'Пожалуйста, заполните пароль';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error',
      });
      return;
    }

    const savedData = localStorage.getItem('employees');
    if (!savedData) return;

    const currentEmployees = JSON.parse(savedData);

    const isPhoneBusy = currentEmployees.some(
      (emp) => emp.phone === phone.trim() && String(emp.id) !== targetId.trim(),
    );
    if (isPhoneBusy) {
      newErrors.phone =
        'Этот номер телефона уже используется другим сотрудником!';
    }

    const isEmailBusy = currentEmployees.some(
      (emp) =>
        emp.email.toLowerCase() === email.trim().toLowerCase() &&
        String(emp.id) !== targetId.trim(),
    );
    if (isEmailBusy) {
      newErrors.email = 'Эта электронная почта уже занята другим сотрудником!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Данные пересекаются с другими сотрудниками',
        severity: 'error',
      });
      return;
    }

    const updatedEmployees = currentEmployees.map((emp) => {
      if (String(emp.id) === targetId.trim()) {
        return {
          id: emp.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role,
          address: address.trim(),
          password: password,
        };
      }
      return emp;
    });

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setNotification({
      text: 'Данные сотрудника успешно изменены!',
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
        Введите ID сотрудника, чьи данные хотите отредактировать
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
          error={!!errors.targetId}
          helperText={errors.targetId}
          variant="standard"
          fullWidth
        />
        <Button variant="contained" onClick={findEmployeeToEdit} sx={{ mt: 1 }}>
          Найти
        </Button>
      </Box>

      {isFormVisible && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Введите новые данные о сотруднике
          </Typography>

          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="ФИО"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />

            <TextField
              label="Электронная почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />

            <TextField
              label="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
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

            <TextField
              label="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              onClick={saveEmployeeChanges}
              sx={{ mt: 1 }}
            >
              Сохранить изменения
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
