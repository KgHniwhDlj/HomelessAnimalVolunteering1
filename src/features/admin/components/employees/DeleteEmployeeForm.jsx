import { useState } from 'react';
import SimpleEmployeeTable from './SimpleEmployeeTable';

export default function DeleteEmployeeForm({ onDeleteSuccess }) {
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
    const employee = currentEmployees.find(
      (emp) => String(emp.id) === targetId.trim(),
    );

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
    const updatedEmployees = currentEmployees.filter(
      (emp) => String(emp.id) !== targetId.trim(),
    );

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
        style={{ margin: '2px 2px 2px 5px' }}
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
            style={{ marginTop: '10px' }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
