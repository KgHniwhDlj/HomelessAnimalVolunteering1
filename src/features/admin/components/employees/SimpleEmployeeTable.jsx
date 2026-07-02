import { useEffect, useState } from 'react';
import MuiTable from '../../../../components/MuiTable';

export default function SimpleEmployeeTable({ employees }) {
  const [localEmployees, setLocalEmployees] = useState([]);

  const employeeColumns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'ФИО', align: 'right' },
    {
      id: 'email',
      label: 'Электронная почта',
      align: 'right',
      sortable: false,
    },
    { id: 'phone', label: 'Телефон', align: 'right', sortable: false },
    { id: 'address', label: 'Адрес', align: 'right', sortable: false },
    { id: 'password', label: 'Пароль', align: 'right', sortable: false },
  ];

  useEffect(() => {
    if (!employees) {
      const saved = localStorage.getItem('employees');
      if (saved) setLocalEmployees(JSON.parse(saved));
    }
  }, [employees]);


  return (
    <>
      <MuiTable data={employees} columns={employeeColumns} />
      {/*<table*/}
      {/*  id="employee-main-table"*/}
      {/*  style={{*/}
      {/*    width: '100%',*/}
      {/*    border: '1px solid black',*/}
      {/*    textAlign: 'left',*/}
      {/*    margin: '10px 10px 10px 5px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <thead>*/}
      {/*    <tr>*/}
      {/*      <th>ID</th>*/}
      {/*      <th>ФИО</th>*/}
      {/*      <th>Электронная почта</th>*/}
      {/*      <th>Телефон</th>*/}
      {/*      <th>Адрес</th>*/}
      {/*      <th>Пароль</th>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {displayList.map((emp) => (*/}
      {/*      <tr key={emp.id}>*/}
      {/*        <td>{emp.id}</td>*/}
      {/*        <td>{emp.name}</td>*/}
      {/*        <td>{emp.email}</td>*/}
      {/*        <td>{emp.phone}</td>*/}
      {/*        <td>{emp.address}</td>*/}
      {/*        <td>{emp.password}</td>*/}
      {/*      </tr>*/}
      {/*    ))}*/}
      {/*  </tbody>*/}
      {/*</table>*/}
    </>
  );
}
