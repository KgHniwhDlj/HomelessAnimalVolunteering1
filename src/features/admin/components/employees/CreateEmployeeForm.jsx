import { useState } from 'react';

export default function CreateEmployeeForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const createNewEmployee = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !password.trim()
    ) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    if (password.length < 8) {
      alert('Пароль слишком короткий!');
      return;
    }
    if (!email.includes('@')) {
      alert('Неверный формат электронной почты!');
      return;
    }
    if (email.trim() === 'admin@example.com') {
      alert('Нельзя!');
      return;
    }

    const phonePattern = /^\+[0-9]{7,15}$/;
    if (!phonePattern.test(phone.trim())) {
      alert(
        "Неверный формат телефона! Номер должен начинаться с '+' и содержать только цифры.",
      );
      return;
    }

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length !== 3) {
      alert(
        'Имя неверно указано. Введите Фамилию, Имя и Отчество через пробел.',
      );
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const isPhoneExists = currentEmployees.some(
      (emp) => emp.phone === phone.trim(),
    );
    if (isPhoneExists) {
      alert('Сотрудник с таким номером телефона существует!');
      return;
    }

    const isEmailExists = currentEmployees.some(
      (emp) => emp.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (isEmailExists) {
      alert('Эта электронная почта занята!');
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

    alert('Сотрудник успешно добавлен!');

    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPassword('');

    if (onSuccess) onSuccess();
  };

  return (
    <>
      <h3>Введите данные нового сотрудника</h3>
      <div
        id="employee-creation-form"
        style={{ margin: '10px 10px 10px 5px', display: 'flex' }}
      >
        <input
          type="text"
          maxLength={200}
          placeholder="ФИО"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={50}
          placeholder="электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={13}
          placeholder="телефон"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={200}
          placeholder="адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={20}
          placeholder="пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button
          id="submit-employee-btn"
          onClick={createNewEmployee}
          style={{ margin: '5px 5px 5px 0' }}
        >
          Добавить работника
        </button>
      </div>
    </>
  );
}
