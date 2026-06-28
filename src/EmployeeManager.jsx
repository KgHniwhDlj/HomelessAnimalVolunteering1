import { useState, useEffect } from 'react';

export default function EmployeeManager() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('employees');
    if (saved) {
      setAllEmployees(JSON.parse(saved));
    }
  }, []);

  const filteredEmployees = allEmployees.filter((employee) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
        String(employee.id) === query ||
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.phone.includes(query)
    );
  });

  return (
      <div>
        <h3>Поиск сотрудников</h3>
        <div style={{ marginBottom: '15px' }}>
          <input
              type="text"
              placeholder="Поиск по ID, имени, почте или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '300px', padding: '5px' }}
          />
          {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ marginLeft: '5px' }}>
                Очистить
              </button>
          )}
        </div>
        <SimpleEmployeeTable employees={filteredEmployees} />
      </div>
  );
}


export function SimpleEmployeeTable({ employees }) {
  const [localEmployees, setLocalEmployees] = useState([]);

  useEffect(() => {

    if (!employees) {
      const saved = localStorage.getItem('employees');
      if (saved) setLocalEmployees(JSON.parse(saved));
    }
  }, [employees]);

  const displayList = employees || localEmployees;

  return (
      <table id="employee-main-table" style={{ width: "100%", border: "1px solid black", textAlign: "left", margin: "10px 10px 10px 5px" }}>
        <thead>
        <tr>
          <th>ID</th>
          <th>ФИО</th>
          <th>Электронная почта</th>
          <th>Телефон</th>
          <th>Адрес</th>
          <th>Пароль</th>
        </tr>
        </thead>
        <tbody>
        {displayList.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.address}</td>
              <td>{emp.password}</td>
            </tr>
        ))}
        </tbody>
      </table>
  );
}



export function CreateEmployeeForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const createNewEmployee = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !password.trim()) {
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
      alert("Неверный формат телефона! Номер должен начинаться с '+' и содержать только цифры.");
      return;
    }

    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length !== 3) {
      alert('Имя неверно указано. Введите Фамилию, Имя и Отчество через пробел.');
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];

    const isPhoneExists = currentEmployees.some(emp => emp.phone === phone.trim());
    if (isPhoneExists) {
      alert('Сотрудник с таким номером телефона существует!');
      return;
    }

    const isEmailExists = currentEmployees.some(emp => emp.email.toLowerCase() === email.trim().toLowerCase());
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
      password: password
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
      <div id="employee-creation-form" style={{ margin: "10px 10px 10px 5px" }}>
        <h3>Введите данные нового сотрудника</h3>
        <input type="text" maxLength={200} placeholder="ФИО" value={name} onChange={(e) => setName(e.target.value)} /><br />
        <input type="text" maxLength={50} placeholder="электронная почта" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input type="text" maxLength={13} placeholder="телефон" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
        <input type="text" maxLength={200} placeholder="адрес" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
        <input type="text" maxLength={20} placeholder="пароль" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button id="submit-employee-btn" onClick={createNewEmployee} style={{ margin: "5px 5px 5px 0" }}>
          Добавить работника
        </button>
      </div>
  );
}


export function DeleteEmployeeForm({ onDeleteSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const findEmployeeToDelete = () => {
    if (!targetId.trim()) {
      alert('Пожалуйста, введите ID сотрудника!');
      return;
    }

    const savedData = localStorage.getItem('employees');
    const currentEmployees = savedData ? JSON.parse(savedData) : [];
    const employee = currentEmployees.find(emp => String(emp.id) === targetId.trim());

    if (!employee) {
      alert('Сотрудник с таким ID не найден!');
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
    const updatedEmployees = currentEmployees.filter(emp => String(emp.id) !== targetId.trim());

    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    alert('Сотрудник успешно удален!');

    setIsInfoVisible(false);
    setFoundEmployee(null);
    setTargetId('');

    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
      <div id="employee-deletion">
        <h3>Введите ID сотрудника для его удаления</h3>
        <input
            type="text"
            style={{ margin: "2px 2px 2px 5px" }}
            placeholder="ID сотрудника"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
        />
        <button id="deletion-employee-found-btn" onClick={findEmployeeToDelete}>
          Найти
        </button>

        {isInfoVisible && foundEmployee && (
            <div className="employee-container-info" id="employee-deletion-info">

              <SimpleEmployeeTable employees={[foundEmployee]} />

              <button
                  id="deletion-employee-btn"
                  onClick={confirmEmployeeDeletion}
                  style={{ marginTop: "10px" }}
              >
                Удалить
              </button>
            </div>
        )}
      </div>
  );
}


export function EditEmployeeForm({ onEditSuccess }) {
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

    const employee = currentEmployees.find(emp => String(emp.id) === targetId.trim());

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
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !password.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const savedData = localStorage.getItem('employees');
    if (!savedData) return;

    const currentEmployees = JSON.parse(savedData);

    const isPhoneBusy = currentEmployees.some(emp => emp.phone === phone.trim() && String(emp.id) !== targetId.trim());
    if (isPhoneBusy) {
      alert('Этот номер телефона уже используется другим сотрудником!');
      return;
    }

    const isEmailBusy = currentEmployees.some(emp => emp.email.toLowerCase() === email.trim().toLowerCase() && String(emp.id) !== targetId.trim());
    if (isEmailBusy) {
      alert('Эта электронная почта уже занята другим сотрудником!');
      return;
    }

    const updatedEmployees = currentEmployees.map(emp => {
      if (String(emp.id) === targetId.trim()) {
        return {
          id: emp.id,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role,
          address: address.trim(),
          password: password
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
      <div id="employee-editing" style={{ margin: "10px 10px 10px 5px" }}>
        <h3>Введите ID сотрудника, чьи данные хотите отредактировать</h3>
        <input
            type="text"
            placeholder="Введите ID"
            style={{ width: "150px", marginBottom: "10px", padding: "4px" }}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
        />
        <button id="editing-employee-found-btn" onClick={findEmployeeToEdit} style={{ marginLeft: "5px" }}>
          Найти
        </button>

        {isFormVisible && (
            <div id="employee-editing-form" style={{ marginTop: "10px" }}>
              <input type="text" placeholder="ФИО" value={name} onChange={(e) => setName(e.target.value)} /><br />
              <input type="text" placeholder="Электронная почта" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
              <input type="text" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} /><br />
              <input type="text" placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
              <input type="text" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
              <button id="save-employee-changes-btn" onClick={saveEmployeeChanges} style={{ marginTop: "5px" }}>
                Сохранить изменения
              </button>
            </div>
        )}
      </div>
  );
}

