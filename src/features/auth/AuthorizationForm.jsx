import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <>
    <div
      className="counter-interaction"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        placeholder="Электронная почта"
        maxLength={50}
        style={{
          width: '300px',
          height: '30px',
          fontSize: '12pt',
          border: '1px solid #3e332e',
          marginBottom: '2px',
          marginTop: '2px',
          padding: '5px',
        }}
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        maxLength={30}
        style={{
          width: '300px',
          height: '30px',
          fontSize: '12pt',
          border: '1px solid #3e332e',
          marginBottom: '2px',
        }}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button
        id="submit-btn"
        className="auth-btn"
        type="button"
        style={{ width: '80px', fontSize: '12pt' }}
        onClick={authenticate}
        >
        Войти
    </button>
    </div>
</>
);
}