import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';

export default function AuthorizationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const authenticate = () => {
    const userEmail = email.trim();
    const userPassword = password;

    if (userEmail === '' || userPassword === '') {
      alert('Пожалуйста, введите данные');
      return;
    }

    if (userEmail === 'admin@example.com' && userPassword === 'admin123') {
      navigate('/admin');
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const foundEmployee = currentEmployees.find(
      emp => emp.email.toLowerCase() === userEmail.toLowerCase()
    );

    if (!foundEmployee) {
      alert("Пользователя с такой почтой не существует!");
      return;
    }

    if (foundEmployee.password !== userPassword) {
      alert("Неверный пароль!");
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
      <TextField
        id="outlined-required"
        label="Электронная почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      <TextField
        id="outlined-password-input"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Button
        variant="contained"
        onClick={authenticate}
        sx={{ mt: 1 }}
      >
        Войти
      </Button>
    </Box>
  );
}