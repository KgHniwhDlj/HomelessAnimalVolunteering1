import { useState } from 'react';

export default function EditEmployeeForm({ onEditSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');

  const findEmployeeToEdit = () => {
    if (!targetId.trim()) {
      alert('Пожалуйста, введите ID сотрудника!');
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const employee = currentEmployees.find(
      (emp) => String(emp.id) === targetId.trim(),
    );

    if (!employee) {
      alert('Сотрудник с таким ID не найден!');
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

    const savedData = localStorage.getItem('employees');
    if (!savedData) return;

    const currentEmployees = JSON.parse(savedData);

    const isPhoneBusy = currentEmployees.some(
      (emp) => emp.phone === phone.trim() && String(emp.id) !== targetId.trim(),
    );
    if (isPhoneBusy) {
      alert('Этот номер телефона уже используется другим сотрудником!');
      return;
    }

    const isEmailBusy = currentEmployees.some(
      (emp) =>
        emp.email.toLowerCase() === email.trim().toLowerCase() &&
        String(emp.id) !== targetId.trim(),
    );
    if (isEmailBusy) {
      alert('Эта электронная почта уже занята другим сотрудником!');
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
    alert('Данные сотрудника успешно изменены!');

    setIsFormVisible(false);
    setTargetId('');

    if (onEditSuccess) onEditSuccess();
  };

  return (
    <div id="employee-editing" style={{ margin: '10px 10px 10px 5px' }}>
      <h3>Введите ID сотрудника, чьи данные хотите отредактировать</h3>
      <input
        type="text"
        placeholder="Введите ID"
        style={{ width: '150px', marginBottom: '10px', padding: '4px' }}
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
      />
      <button
        id="editing-employee-found-btn"
        onClick={findEmployeeToEdit}
        style={{ marginLeft: '5px' }}
      >
        Найти
      </button>

      {isFormVisible && (
        <div id="employee-editing-form" style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="ФИО"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Электронная почта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button
            id="save-employee-changes-btn"
            onClick={saveEmployeeChanges}
            style={{ marginTop: '5px' }}
          >
            Сохранить изменения
          </button>
        </div>
      )}
    </div>
  );
}
