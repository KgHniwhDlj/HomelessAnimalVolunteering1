import { useState, useEffect } from 'react';
import MuiTable from './MuiTable';

export default function EnclosureManager() {
    const [allEnclosures, setAllEnclosures] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('enclosures');
        if (saved) {
            setAllEnclosures(JSON.parse(saved));
        }
    }, []);

    const filteredEnclosures = allEnclosures.filter((enclosure) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return (
            String(enclosure.id) === query ||
            enclosure.name.toLowerCase().includes(query) ||
            enclosure.size.toLowerCase().includes(query) ||
            enclosure.date.includes(query)
        );
    });

    return (
        <div>
            <h3>Поиск вольеров</h3>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Поиск по ID, названию, размеру или дате..."
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
            <SimpleEnclosureTable enclosures={filteredEnclosures} />
        </div>
    );
}


export function SimpleEnclosureTable({ enclosures }) {
    const [localEnclosures, setLocalEnclosures] = useState([]);

    const enclosureColumns = [
      { id: 'id', label: 'ID' },
      { id: 'name', label: 'Название', align: 'right' },
      {
        id: 'size',
        label: 'Размер (кв. м)',
        align: 'right',
        sortable: false,
      },
      { id: 'date', label: 'Дата создания', align: 'right', sortable: false },
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



export function CreateEnclosureForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');

    const createNewEnclosure = () => {
        if (!name.trim() || !size.trim() || !date.trim() || !address.trim())  {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const savedData = localStorage.getItem('enclosures');
        const currentEnclosures = savedData ? JSON.parse(savedData) : [];


        const enclosureID = Date.now();
        const newEnclosureData = {
            id: enclosureID,
            name: name.trim(),
            size: size.trim(),
            date: date.trim(),
            address: address.trim()
        };

        const updatedEnclosures = [...currentEnclosures, newEnclosureData];
        localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));

        alert('Вольер успешно добавлен!');

        setName('');
        setSize('');
        setDate('');
        setAddress('');

        if (onSuccess) onSuccess();
    };

    return (
        <div id="enclosure-creation-form" style={{ margin: "10px 10px 10px 5px" }}>
            <h3>Введите данные нового вольера</h3>
            <input type="text" maxLength={200} placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <input type="text" maxLength={50} placeholder="Размер" value={size} onChange={(e) => setSize(e.target.value)} /><br />
            <input type="date" maxLength={13} placeholder="Дата" value={date} onChange={(e) => setDate(e.target.value)} /><br />
            <input type="text" maxLength={200} placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
            <button id="submit-enclosure-btn" onClick={createNewEnclosure} style={{ margin: "5px 5px 5px 0" }}>
                Добавить вольер
            </button>

        </div>
    );
}


export function DeleteEnclosureForm({ onDeleteSuccess }) {
    const [targetId, setTargetId] = useState('');
    const [foundEnclosure, setFoundEnclosure] = useState(null);
    const [isInfoVisible, setIsInfoVisible] = useState(false);

    const findEnclosureToDelete = () => {
        if (!targetId.trim()) {
            alert('Пожалуйста, введите ID вольера!');
            return;
        }

        const savedData = localStorage.getItem('enclosures');
        const currentEnclosures = savedData ? JSON.parse(savedData) : [];
        const enclosure = currentEnclosures.find(enc => String(enc.id) === targetId.trim());

        if (!enclosure) {
            alert('Вольер с таким ID не найден!');
            setIsInfoVisible(false);
            setFoundEnclosure(null);
            return;
        }

        setFoundEnclosure(enclosure);
        setIsInfoVisible(true);
    };

    const confirmEnclosureDeletion = () => {
        const savedData = localStorage.getItem('enclosures');
        if (!savedData) return;

        const currentEnclosures = JSON.parse(savedData);
        const updatedEnclosures = currentEnclosures.filter(enc => String(enc.id) !== targetId.trim());

        localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));
        alert('Вольер успешно удален!');

        setIsInfoVisible(false);
        setFoundEnclosure(null);
        setTargetId('');

        if (onDeleteSuccess) onDeleteSuccess();
    };

    return (
        <div id="enclosure-deletion">
            <h3>Введите ID вольера для его удаления</h3>
            <input
                type="text"
                style={{ margin: "2px 2px 2px 5px" }}
                placeholder="ID вольера"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
            />
            <button id="deletion-enclosure-found-btn" onClick={findEnclosureToDelete}>
                Найти
            </button>

            {isInfoVisible && foundEnclosure && (
                <div className="enclosure-container-info" id="enclosure-deletion-info">

                    <SimpleEnclosureTable enclosures={[foundEnclosure]} />

                    <button
                        id="deletion-enclosure-btn"
                        onClick={confirmEnclosureDeletion}
                        style={{ marginTop: "10px" }}
                    >
                        Удалить
                    </button>
                </div>
            )}
        </div>
    );
}


export function EditEnclosureForm({ onEditSuccess }) {
    const [targetId, setTargetId] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const [name, setName] = useState('');
    const [size, setSize] = useState('');
    const [date, setDate] = useState('');
    const [address, setAddress] = useState('');

    const findEnclosureToEdit = () => {
        if (!targetId.trim()) {
            alert('Пожалуйста, введите ID вольера!');
            return;
        }

        const savedData = localStorage.getItem('enclosures');
        const currentEnclosures = savedData ? JSON.parse(savedData) : [];

        const enclosure = currentEnclosures.find(enc => String(enc.id) === targetId.trim());

        if (!enclosure) {
            alert('Вольер с таким ID не найден!');
            setIsFormVisible(false);
            return;
        }

        setName(enclosure.name);
        setSize(enclosure.size);
        setDate(enclosure.date);
        setAddress(enclosure.address);

        setIsFormVisible(true);
    };

    const saveEnclosureChanges = () => {
        if (!name.trim() || !size.trim() || !date.trim() || !address.trim()) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        const savedData = localStorage.getItem('enclosures');
        if (!savedData) return;

        const currentEnclosures = JSON.parse(savedData);



        const updatedEnclosures = currentEnclosures.map(enc => {
            if (String(enc.id) === targetId.trim()) {
                return {
                    id: enc.id,
                    name: name.trim(),
                    size: size.trim(),
                    date: date,
                    address: address.trim()
                };
            }
            return enc;
        });

        localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));
        alert('Данные вольера успешно изменены!');

        setIsFormVisible(false);
        setTargetId('');

        if (onEditSuccess) onEditSuccess();
    };

    return (
        <div id="enclosure-editing" style={{ margin: "10px 10px 10px 5px" }}>
            <h3>Введите ID вольера, чьи данные хотите отредактировать</h3>
            <input
                type="text"
                placeholder="Введите ID"
                style={{ width: "150px", marginBottom: "10px", padding: "4px" }}
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
            />
            <button id="editing-enclosure-found-btn" onClick={findEnclosureToEdit} style={{ marginLeft: "5px" }}>
                Найти
            </button>

            {isFormVisible && (
                <div id="enclosure-editing-form" style={{ marginTop: "10px" }}>
                    <input type="text" placeholder="ФИО" value={name} onChange={(e) => setName(e.target.value)} /><br />
                    <input type="text" placeholder="Размер" value={size} onChange={(e) => setSize(e.target.value)} /><br />
                    <input type="date" placeholder="Дата" value={date} onChange={(e) => setDate(e.target.value)} /><br />
                    <input type="text" placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} /><br />
                    <button id="save-enclosure-changes-btn" onClick={saveEnclosureChanges} style={{ marginTop: "5px" }}>
                        Сохранить изменения
                    </button>
                </div>
            )}
        </div>
    );
}

