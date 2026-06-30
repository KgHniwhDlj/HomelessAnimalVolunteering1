import { useEffect, useState } from 'react';
import MuiTable from '../../../../components/MuiTable';

export default function SimpleEnclosureTable({ enclosures }) {
  const [localEnclosures, setLocalEnclosures] = useState([]);

  const enclosureColumns = [
    { id: 'id', label: 'ID' },
    { id: 'name', label: 'Название', align: 'right' },
    {
      id: 'size',
      label: 'Размер (кв. м)',
      align: 'right',
    },
    { id: 'date', label: 'Дата создания', align: 'right' },
    { id: 'address', label: 'Адрес', align: 'right', sortable: false },
  ];

  useEffect(() => {
    if (!enclosures) {
      const saved = localStorage.getItem('enclosures');
      if (saved) setLocalEnclosures(JSON.parse(saved));
    }
  }, [enclosures]);

  const displayList = enclosures || localEnclosures;

  return (
    <>
      <MuiTable data={enclosures} columns={enclosureColumns} />
      {/*<table*/}
      {/*  id="enclosure-main-table"*/}
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
      {/*      <th>Кличка</th>*/}
      {/*      <th>Размер</th>*/}
      {/*      <th>Дата создания</th>*/}
      {/*      <th>Адрес</th>*/}
      {/*    </tr>*/}
      {/*  </thead>*/}
      {/*  <tbody>*/}
      {/*    {displayList.map((enc) => (*/}
      {/*      <tr key={enc.id}>*/}
      {/*        <td>{enc.id}</td>*/}
      {/*        <td>{enc.name}</td>*/}
      {/*        <td>{enc.size}</td>*/}
      {/*        <td>{enc.date}</td>*/}
      {/*        <td>{enc.address}</td>*/}
      {/*      </tr>*/}
      {/*    ))}*/}
      {/*  </tbody>*/}
      {/*</table>*/}
    </>
  );
}
