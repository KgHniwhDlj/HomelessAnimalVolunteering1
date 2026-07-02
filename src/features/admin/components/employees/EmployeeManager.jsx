import { useState, useEffect } from 'react';
import SimpleEmployeeTable from './SimpleEmployeeTable';
import { Box, Button, TextField, Typography } from '@mui/material';



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
    <Box>
      <Typography variant="h6" gutterBottom>
        Поиск сотрудников
      </Typography>

      <Box sx={{ mb: '15px' }}>
        <TextField
          label="ID, имя, почта или телефон..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ p: '5px' }}
          variant="standard"
        />

        {searchQuery && (
          <Button variant="contained" sx={{ backgroundColor: '#3e332e', color: '#ffdfdf'}} onClick={() => setSearchQuery('')}>
            Очистить
          </Button>
        )}
      </Box>

      <SimpleEmployeeTable employees={filteredEmployees} />
    </Box>
  );
}
