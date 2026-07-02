import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import CreateEmployeeForm from '../features/admin/components/employees/CreateEmployeeForm';
import EmployeeManager from '../features/admin/components/employees/EmployeeManager';
import DeleteEmployeeForm from '../features/admin/components/employees/DeleteEmployeeForm';
import EditEmployeeForm from '../features/admin/components/employees/EditEmployeeForm';
import CreateEnclosureForm from '../features/admin/components/enclosures/CreateEnclosureForm';
import EnclosureManager from '../features/admin/components/enclosures/EnclosureManager';
import DeleteEnclosureForm from '../features/admin/components/enclosures/DeleteEnclosureForm';
import EditEnclosureForm from '../features/admin/components/enclosures/EditEnclosureForm';
import SimpleEmployeeTable from '../features/admin/components/employees/SimpleEmployeeTable';
import SimpleEnclosureTable from '../features/admin/components/enclosures/SimpleEnclosureTable';


export function toggleTables(setNewStatus) {
    setNewStatus(prevState => !prevState);
}

export default function AdminTables({ onLogout }) {
    const [isEmployeeTable, setIsEmployeeTable] = useState(true);

    const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
    const [isFindEmployeeOpen, setIsFindEmployeeOpen] = useState(false);
    const [isDeleteEmployeeOpen, setIsDeleteEmployeeOpen] = useState(false);
    const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);

    const [isCreateEnclosureOpen, setIsCreateEnclosureOpen] = useState(false);
    const [isFindEnclosureOpen, setIsFindEnclosureOpen] = useState(false);
    const [isDeleteEnclosureOpen, setIsDeleteEnclosureOpen] = useState(false);
    const [isEditEnclosureOpen, setIsEditEnclosureOpen] = useState(false);

    const [employees, setEmployees] = useState([]);
    const [enclosures, setEnclosures] = useState([]);


    useEffect(() => {
        refreshEmployees();
        refreshEnclosures();
    }, []);

    const refreshEmployees = () => {
        const saved = localStorage.getItem('employees');
        setEmployees(saved ? JSON.parse(saved) : []);
    };

    const refreshEnclosures = () => {
        const saved = localStorage.getItem('enclosures');
        setEnclosures(saved ? JSON.parse(saved) : []);
    };


    return (
      <>
        <header>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              m: '10px 10px 10px 5px',
            }}
          >
            <Typography variant="h2" gutterBottom>
              {isEmployeeTable ? 'Список сотрудников' : 'Список вольеров'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onLogout}
              sx={{ mt: 1, backgroundColor: '#ffdfdf', color: '#3e332e' }}
            >
              Выйти из системы
            </Button>
          </Box>
        </header>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
          onClick={() => setIsEmployeeTable(!isEmployeeTable)}
        >
          {isEmployeeTable ? 'Перейти к вольерам' : 'Перейти к сотрудникам'}
        </Button>
        {isEmployeeTable && (
          <Box
            sx={{
              m: '10px 10px 10px 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsCreateEmployeeOpen)}
            >
              Зарегистрировать сотрудника
            </Button>
            {isCreateEmployeeOpen && (
              <Box sx={{ m: '10px 10px 10px 5px' }}>
                <CreateEmployeeForm
                  onSuccess={() => {
                    setIsCreateEmployeeOpen(false);
                    refreshEmployees();
                  }}
                />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsFindEmployeeOpen)}
            >
              Найти сотрудника
            </Button>
            {isFindEmployeeOpen && (
              <Box sx={{ m: '10px 10px 10px 5px' }}>
                <EmployeeManager />
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsEditEmployeeOpen)}
            >
              Редактировать данные
            </Button>
            {isEditEmployeeOpen && (
              <EditEmployeeForm
                onEditSuccess={() => {
                  setIsEditEmployeeOpen(false);
                  refreshEmployees();
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsDeleteEmployeeOpen)}
            >
              Удалить сотрудника
            </Button>
            {isDeleteEmployeeOpen && (
              <DeleteEmployeeForm
                onDeleteSuccess={() => {
                  setIsDeleteEmployeeOpen(false);
                  refreshEmployees();
                }}
              />
            )}
          </Box>
        )}

        {!isEmployeeTable && (
          <Box
            sx={{
              m: '10px 10px 10px 5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsCreateEnclosureOpen)}
            >
              Создать вольер
            </Button>
            {isCreateEnclosureOpen && (
              <CreateEnclosureForm
                onSuccess={() => {
                  setIsCreateEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsFindEnclosureOpen)}
            >
              Найти вольер
            </Button>
            {isFindEnclosureOpen && (
              <Box style={{ margin: '10px 10px 10px 5px' }}>
                <EnclosureManager />
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsEditEnclosureOpen)}
            >
              Редактировать вольер
            </Button>
            {isEditEnclosureOpen && !isEmployeeTable && (
              <EditEnclosureForm
                onEditSuccess={() => {
                  setIsEditEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
              onClick={() => toggleTables(setIsDeleteEnclosureOpen)}
            >
              Удалить вольер
            </Button>
            {isDeleteEnclosureOpen && !isEmployeeTable && (
              <DeleteEnclosureForm
                onDeleteSuccess={() => {
                  setIsDeleteEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
          </Box>
        )}
        {isEmployeeTable ? (
          <SimpleEmployeeTable employees={employees} />
        ) : (
          <SimpleEnclosureTable enclosures={enclosures} />
        )}
      </>
    );
}