import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '10px 10px 10px 5px',
            }}
          >
            <button className="exit-btn" onClick={onLogout}>
              Выйти из системы
            </button>
          </div>

          <h2>{isEmployeeTable ? 'Список сотрудников' : 'Список вольеров'}</h2>
        </header>
        <button
          className="change-table-btn"
          onClick={() => setIsEmployeeTable(!isEmployeeTable)}
          style={{ margin: '5px 5px 5px 0' }}
        >
          {isEmployeeTable ? 'Перейти к вольерам' : 'Перейти к сотрудникам'}
        </button>
        {isEmployeeTable && (
          <div
            className="vertical-buttons"
            style={{ margin: '10px 10px 10px 5px' }}
          >
            <button
              className="pet-btn"
              type="button"
              onClick={() => toggleTables(setIsCreateEmployeeOpen)}
            >
              Зарегистрировать сотрудника
            </button>
            {isCreateEmployeeOpen && (
              <div style={{ margin: '10px 10px 10px 5px' }}>
                <CreateEmployeeForm
                  onSuccess={() => {
                    setIsCreateEmployeeOpen(false);
                    refreshEmployees();
                  }}
                />
              </div>
            )}
            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsFindEmployeeOpen)}
            >
              Найти сотрудника
            </button>
            {isFindEmployeeOpen && (
              <div
                id="find-employee-container"
                style={{ margin: '10px 10px 10px 5px' }}
              >
                <EmployeeManager />
              </div>
            )}
            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsEditEmployeeOpen)}
            >
              Редактировать данные
            </button>
            {isEditEmployeeOpen && (
              <EditEmployeeForm
                onEditSuccess={() => {
                  setIsEditEmployeeOpen(false);
                  refreshEmployees();
                }}
              />
            )}
            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsDeleteEmployeeOpen)}
            >
              Удалить сотрудника
            </button>
            {isDeleteEmployeeOpen && (
              <DeleteEmployeeForm
                onDeleteSuccess={() => {
                  setIsDeleteEmployeeOpen(false);
                  refreshEmployees();
                }}
              />
            )}
          </div>
        )}

        {!isEmployeeTable && (
          <div
            className="vertical-buttons"
            style={{ margin: '10px 10px 10px 5px' }}
          >
            <button
              className="pet-btn"
              type="button"
              onClick={() => toggleTables(setIsCreateEnclosureOpen)}
            >
              Создать вольер
            </button>
            {isCreateEnclosureOpen && (
              <CreateEnclosureForm
                onSuccess={() => {
                  setIsCreateEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsFindEnclosureOpen)}
            >
              Найти вольер
            </button>
            {isFindEnclosureOpen && (
              <div style={{ margin: '10px 10px 10px 5px' }}>
                <EnclosureManager />
              </div>
            )}

            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsEditEnclosureOpen)}
            >
              Редактировать вольер
            </button>
            {isEditEnclosureOpen && !isEmployeeTable && (
              <EditEnclosureForm
                onEditSuccess={() => {
                  setIsEditEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
            <button
              className="pet-btn"
              onClick={() => toggleTables(setIsDeleteEnclosureOpen)}
            >
              Удалить вольер
            </button>
            {isDeleteEnclosureOpen && !isEmployeeTable && (
              <DeleteEnclosureForm
                onDeleteSuccess={() => {
                  setIsDeleteEnclosureOpen(false);
                  refreshEnclosures();
                }}
              />
            )}
          </div>
        )}
        {isEmployeeTable ? (
          <SimpleEmployeeTable employees={employees} />
        ) : (
          <SimpleEnclosureTable enclosures={enclosures} />
        )}
      </>
    );
}