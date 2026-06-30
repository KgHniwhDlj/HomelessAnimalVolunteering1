import { useState, useEffect } from 'react';
import SimpleEmployeeTable from './SimpleEmployeeTable';



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
