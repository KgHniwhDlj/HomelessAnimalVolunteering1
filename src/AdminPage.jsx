import { useState, useEffect } from 'react';
import EmployeeManager, {
    SimpleEmployeeTable,
    CreateEmployeeForm,
    DeleteEmployeeForm,
    EditEmployeeForm
} from "./EmployeeManager";
import EnclosureManager, {
    CreateEnclosureForm,
    DeleteEnclosureForm,
    EditEnclosureForm,
    SimpleEnclosureTable
} from "./EnclosureManager";
import { Box } from '@mui/material';


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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "10px 10px 10px 5px" }}>
                <button className="change-table-btn" onClick={() => setIsEmployeeTable(!isEmployeeTable)} style={{ margin: 0 }}>
                    {isEmployeeTable ? "Перейти к вольерам" : "Перейти к сотрудникам"}
                </button>

                <button className="pet-btn" onClick={onLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', margin: 0, cursor: 'pointer' }}>
                    Выйти из системы
                </button>
            </div>

            <h2>{isEmployeeTable ? "Список сотрудников" : "Список вольеров"}</h2>

            {isEmployeeTable && (
                <div className="vertical-buttons" style={{ margin: "10px 10px 10px 5px" }}>
                    <button className="pet-btn" type="button" onClick={() => toggleTables(setIsCreateEmployeeOpen)}>
                        Зарегистрировать сотрудника
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsFindEmployeeOpen)}>
                        Найти сотрудника
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsDeleteEmployeeOpen)}>
                        Удалить сотрудника
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsEditEmployeeOpen)}>
                        Редактировать данные
                    </button>
                </div>
            )}

            {!isEmployeeTable && (
                <div className="vertical-buttons" style={{ margin: "10px 10px 10px 5px" }}>
                    <button className="pet-btn" type="button" onClick={() => toggleTables(setIsCreateEnclosureOpen)}>
                        Создать вольер
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsFindEnclosureOpen)}>
                        Найти вольер
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsDeleteEnclosureOpen)}>
                        Удалить вольер
                    </button>
                    <button className="pet-btn" onClick={() => toggleTables(setIsEditEnclosureOpen)}>
                        Редактировать вольер
                    </button>
                </div>
            )}

            {isCreateEmployeeOpen && isEmployeeTable && (
                <div style={{ margin: "10px 10px 10px 5px" }}>
                    <CreateEmployeeForm onSuccess={() => { setIsCreateEmployeeOpen(false); refreshEmployees(); }} />
                </div>
            )}
            {isFindEmployeeOpen && isEmployeeTable && (
                <div id="find-employee-container" style={{ margin: "10px 10px 10px 5px" }}>
                    <EmployeeManager />
                </div>
            )}
            {isDeleteEmployeeOpen && isEmployeeTable && (
                <DeleteEmployeeForm onDeleteSuccess={() => { setIsDeleteEmployeeOpen(false); refreshEmployees(); }} />
            )}
            {isEditEmployeeOpen && isEmployeeTable && (
                <EditEmployeeForm onEditSuccess={() => { setIsEditEmployeeOpen(false); refreshEmployees(); }} />
            )}

            {isCreateEnclosureOpen && !isEmployeeTable && (
                <CreateEnclosureForm onSuccess={() => { setIsCreateEnclosureOpen(false); refreshEnclosures(); }} />

            )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {isFindEnclosureOpen && !isEmployeeTable && (
                <EnclosureManager />
            )}

            {isDeleteEnclosureOpen && !isEmployeeTable && (
                <DeleteEnclosureForm onDeleteSuccess={() => { setIsDeleteEnclosureOpen(false); refreshEnclosures(); }} />
            )}
            {isEditEnclosureOpen && !isEmployeeTable && (
                <EditEnclosureForm onEditSuccess={() => { setIsEditEnclosureOpen(false); refreshEnclosures(); }} />
            )}
            <Box>
            {isEmployeeTable ?
                <SimpleEmployeeTable employees={employees} /> :
                <SimpleEnclosureTable enclosures={enclosures} />
            }
            </Box>
          </Box>
        </>
    );
}