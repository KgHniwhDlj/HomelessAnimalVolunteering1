import { useState } from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';


export default function CreateEmployeeForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const createNewEmployee = () => {
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

    if (password.length < 8) {
      newErrors.password = 'Пароль слишком короткий (минимум 8 символов)!';
    }
    if (!email.includes('@')) {
      newErrors.email = 'Неверный формат электронной почты!';
    } else if (email.trim() === 'admin@example.com') {
      newErrors.email = 'Регистрация этого email запрещена!';
    }

    const phonePattern = /^\+[0-9]{7,15}$/;
    if (!phonePattern.test(phone.trim())) {
      newErrors.phone =
        "Номер должен начинаться с '+' и содержать от 7 до 15 цифр.";
    }

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length !== 3) {
      newErrors.name = 'Введите Фамилию, Имя и Отчество через пробел.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Проверьте правильность заполнения полей',
        severity: 'error',
      });
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const isPhoneExists = currentEmployees.some(
      (emp) => emp.phone === phone.trim(),
    );
    if (isPhoneExists) {
      newErrors.phone = 'Сотрудник с таким номером телефона существует!';
    }

    const isEmailExists = currentEmployees.some(
      (emp) => emp.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (isEmailExists) {
      newErrors.email = 'Эта электронная почта занята!';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Данные сотрудника уже зарегистрированы',
        severity: 'error',
      });
      return;
    }

    const employeeID = Date.now();
    const newEmployeeData = {
      id: employeeID,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'employee',
      address: address.trim(),
      password: password,
    };

    const updatedEmployees = [...currentEmployees, newEmployeeData];
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    setNotification({
      text: 'Сотрудник успешно добавлен!',
      severity: 'success',
    });
    setErrors({});

    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPassword('');

    if (onSuccess) onSuccess();
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Введите данные нового сотрудника
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={createNewEmployee}
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
        >
          Добавить работника
        </Button>
      </Box>
    </Box>
  );
}
