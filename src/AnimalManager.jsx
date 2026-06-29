import { useState, useEffect } from 'react';
import MuiTable from './MuiTable';
import BasicSelect from './MuiSelect';
import { useEnclosures } from './UseEnclosures';

export default function PetManager() {
    const [allPets, setAllPets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('pets');
        if (saved) {
            setAllPets(JSON.parse(saved));
        }
    }, []);

    const filteredPets = allPets.filter((pet) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();

        return (
            String(pet.id) === query ||
            pet.name?.toLowerCase().includes(query) ||
            pet.species?.toLowerCase().includes(query) ||
            pet.enclosure?.toLowerCase().includes(query) ||
            pet.status?.toLowerCase().includes(query)
        );
    });

    return (
        <div>
            <h3>Поиск питомцев</h3>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Поиск по ID, кличке, виду, вольеру или статусу..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '350px', padding: '5px' }}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ marginLeft: '5px' }}>
                        Очистить
                    </button>
                )}
            </div>
            <SimplePetTable pets={filteredPets} />
        </div>
    );
}

export function SimplePetTable({ pets: propsPets }) {
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
        <MuiTable data={propsPets} columns={animalColumns}/>
        {/*<table*/}
        {/*  id="pet-main-table"*/}
        {/*  style={{*/}
        {/*    width: '100%',*/}
        {/*    border: '1px solid black',*/}
        {/*    padding: '4px',*/}
        {/*    textAlign: 'left',*/}
        {/*    margin: '10px 10px 10px 5px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <thead>*/}
        {/*    <tr style={{ backgroundColor: '#f2f2f2' }}>*/}
        {/*      <th>ID</th>*/}
        {/*      <th>Кличка</th>*/}
        {/*      <th>Вид</th>*/}
        {/*      <th>Вольер</th>*/}
        {/*      <th>Состояние</th>*/}
        {/*      <th>Статус</th>*/}
        {/*      <th>Дата добавления</th>*/}
        {/*      <th>Добавил(а)</th>*/}
        {/*      <th>Дата последнего изменения</th>*/}
        {/*      <th>Изменил(а)</th>*/}
        {/*      <th>Описание</th>*/}
        {/*    </tr>*/}
        {/*  </thead>*/}
        {/*  <tbody>*/}
        {/*    {displayPets.length > 0 ? (*/}
        {/*      displayPets.map((pet) => (*/}
        {/*        <tr key={pet.id} style={{ borderBottom: '1px solid #ddd' }}>*/}
        {/*          <td>{pet.id}</td>*/}
        {/*          <td>{pet.name}</td>*/}
        {/*          <td>{pet.species}</td>*/}
        {/*          <td>{pet.enclosure}</td>*/}
        {/*          <td>{pet.conditions}</td>*/}
        {/*          <td>{pet.status}</td>*/}
        {/*          <td>{pet.addDate}</td>*/}
        {/*          <td>{pet.addEmployee}</td>*/}
        {/*          <td>{pet.updateDate}</td>*/}
        {/*          <td>{pet.updateEmployee}</td>*/}
        {/*          <td>{pet.description}</td>*/}
        {/*        </tr>*/}
        {/*      ))*/}
        {/*    ) : (*/}
        {/*      <tr>*/}
        {/*        <td*/}
        {/*          colSpan="11"*/}
        {/*          style={{ textAlign: 'center', padding: '10px' }}*/}
        {/*        >*/}
        {/*          В базе данных пока нет питомцев*/}
        {/*        </td>*/}
        {/*      </tr>*/}
        {/*    )}*/}
        {/*  </tbody>*/}
        {/*</table>*/}
      </>
    );
}


export function CreatePetForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [enclosure, setEnclosure] = useState('');
    const [description, setDescription] = useState('');
    //const [enclosuresList, setEnclosuresList] = useState([]);

    const fieldStyle = {
        width: "250px",
        boxSizing: "border-box",
        marginBottom: "5px"
    };


  const enclosuresList = useEnclosures();


    const createNewAnimal = () => {
        let currentEmployeeId = localStorage.getItem('current_user_id') || '1';



      if (
        !name.trim() ||
        !species ||
        !enclosure ||
        !condition ||
        !status ||
        !description.trim()
      ) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
        if (description.length > 500) {
            alert('Описание слишком длинное!');
            return;
        }
        if (name.length > 50) {
            alert('Кличка слишком длинная!');
            return;
        }

        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;

        const newAnimalID = Date.now();
        const animalData = {
            id: newAnimalID,
            name: name.trim(),
            species: species,
            enclosure: enclosure,
            conditions: condition,
            status: status,
            addDate: formattedDate,
            addEmployee: currentEmployeeId,
            updateDate: formattedDate,
            updateEmployee: currentEmployeeId,
            description: description.trim(),
        };

        const savedPets = localStorage.getItem('pets');
        const currentPets = savedPets ? JSON.parse(savedPets) : [];
        localStorage.setItem('pets', JSON.stringify([...currentPets, animalData]));

        alert('Питомец успешно добавлен!');
        setName('');
        setDescription('');
        setSpecies('');
        setEnclosure('');
        setCondition('');
        setStatus('');


      if (onSuccess) onSuccess();
    };

  const [condition, setCondition] = useState('');
  const conditionList = [
    { id: 'Здоров(а)', name: 'Здоров(а)' },
    { id: 'Лечение', name: 'Лечение' },
    { id: 'Карантин', name: 'Карантин' },
    { id: 'Травмирован(а)', name: 'Травмирован(а)' },
    { id: 'Инвалидность', name: 'Инвалидность' },
    {
      id: 'Требуется вакцинация / Стерилизация',
      name: 'Требуется вакцинация / Стерилизация',
    },
  ];

  const [status, setStatus] = useState('');
  const statusList = [
    { id: 'Поступил', name: 'Поступил' },
    { id: 'Ищет дом', name: 'Ищет дом' },
    { id: 'Пристроен', name: 'Пристроен' },
  ];

  const [species, setSpecies] = useState('');
  const speciesList = [
    { id: 'Птица', name: 'Птица' },
    { id: 'Собака', name: 'Собака' },
    { id: 'Кошка', name: 'Кошка' },
    { id: 'Кролик', name: 'Кролик' },
    { id: 'Хомяк', name: 'Хомяк' },
    { id: 'Крыса', name: 'Крыса' },
    { id: 'Морская свинка', name: 'Морская свинка' },
    { id: 'Другое', name: 'Другое' },
  ];

    return (
      <div id="create-new-pet-form" style={{ margin: '10px 10px 10px 5px' }}>
        <h3>Введите данные нового питомца</h3>

        <input
          type="text"
          placeholder="Кличка"
          style={fieldStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BasicSelect
          label="Вид"
          options={speciesList}
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
        />
        <BasicSelect
          label="Вольер"
          options={enclosuresList}
          value={enclosure}
          onChange={(e) => setEnclosure(e.target.value)}
        />
        <BasicSelect
          label="Состояние"
          options={conditionList}
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
        <BasicSelect
          label="Статус"
          options={statusList}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <br />

        <textarea
          placeholder="Описание"
          style={{ ...fieldStyle, height: '60px', fontFamily: 'inherit' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />

        <button onClick={createNewAnimal} style={{ margin: '5px 5px 5px 0' }}>
          Добавить питомца
        </button>
      </div>
    );
}