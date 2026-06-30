import { useEffect, useState } from 'react';
import MuiTable from '../../../components/MuiTable';

export default function SimplePetTable({ pets: propsPets }) {
  const [localPets, setLocalPets] = useState([]);

  useEffect(() => {
    if (!propsPets) {
      const savedData = localStorage.getItem('pets');
      if (savedData) {
        setLocalPets(JSON.parse(savedData));
      }
    }
  }, [propsPets]);

  const displayPets = propsPets || localPets;

  const animalColumns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Кличка', align: 'right' },
    {
      id: 'species',
      label: 'Вид',
      align: 'right',
      sortable: false,
    },
    {
      id: 'enclosure',
      label: 'Вольер',
      align: 'right',
      sortable: false,
    },
    { id: 'conditions', label: 'Состояние', align: 'right', sortable: false },
    { id: 'status', label: 'Статус', align: 'right', sortable: false },
    {
      id: 'addDate',
      label: 'Дата добавления',
      align: 'right',
    },
    { id: 'addEmployee', label: 'Добавил(а)', align: 'right', sortable: false },
    {
      id: 'updateDate',
      label: 'Дата последнего изменения',
      align: 'right',
    },
    {
      id: 'updateEmployee',
      label: 'Изменил(а)',
      align: 'right',
      sortable: false,
    },
    { id: 'description', label: 'Описание', align: 'right', sortable: false },
  ];

  return (
    <>
      <MuiTable data={propsPets} columns={animalColumns} />
    </>
  );
}
