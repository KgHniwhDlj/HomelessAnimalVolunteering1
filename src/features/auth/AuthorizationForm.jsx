import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function AuthorizationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState({});

  const authenticate = () => {
    const userEmail = email.trim();
    const userPassword = password;

    setNotification(null);
    setErrors({});

    const newErrors = {};

    if (!userEmail) {
      newErrors.email = 'Пожалуйста, введите электронную почту';
    }
    if (!userPassword) {
      newErrors.password = 'Пожалуйста, введите пароль';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setNotification({
        text: 'Заполните все поля для входа',
        severity: 'error',
      });
      return;
    }

    if (userEmail === 'admin@example.com' && userPassword === 'admin123') {
      navigate('/admin');
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const foundEmployee = currentEmployees.find(
      (emp) => emp.email.toLowerCase() === userEmail.toLowerCase(),
    );

    if (!foundEmployee) {
      setErrors({ email: 'Пользователя с такой почтой не существует!' });
      setNotification({ text: 'Пользователь не найден', severity: 'error' });
      return;
    }

    if (foundEmployee.password !== userPassword) {
      setErrors({ password: 'Неверный пароль!' });
      setNotification({ text: 'Неверный пароль', severity: 'error' });
      return;
    }

    localStorage.setItem('current_user_id', foundEmployee.id);
    navigate('/user');
  };

  return (
    <Box
      sx={{
        p: 2,
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        margin: '0 auto',
      }}
    >
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

      <TextField
        id="outlined-required"
        label="Электронная почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
      />

      <TextField
        id="outlined-password-input"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={authenticate}
        sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
      >
        Войти
      </Button>
    </Box>
  );
}
