import { useState, useEffect } from 'react';

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

    return (
        <table id="pet-main-table" style={{
            width: "100%",
            border: "1px solid black",
            padding: "4px",
            textAlign: "left",
            margin: "10px 10px 10px 5px"
        }}>
            <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th>ID</th>
                <th>Кличка</th>
                <th>Вид</th>
                <th>Вольер</th>
                <th>Состояние</th>
                <th>Статус</th>
                <th>Дата добавления</th>
                <th>Добавил(а)</th>
                <th>Дата последнего изменения</th>
                <th>Изменил(а)</th>
                <th>Описание</th>
            </tr>
            </thead>
            <tbody>
            {displayPets.length > 0 ? (
                displayPets.map((pet) => (
                    <tr key={pet.id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td>{pet.id}</td>
                        <td>{pet.name}</td>
                        <td>{pet.species}</td>
                        <td>{pet.enclosure}</td>
                        <td>{pet.conditions}</td>
                        <td>{pet.status}</td>
                        <td>{pet.addDate}</td>
                        <td>{pet.addEmployee}</td>
                        <td>{pet.updateDate}</td>
                        <td>{pet.updateEmployee}</td>
                        <td>{pet.description}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="11" style={{ textAlign: "center", padding: "10px" }}>
                        В базе данных пока нет питомцев
                    </td>
                </tr>
            )}
            </tbody>
        </table>
    );
}


export function CreatePetForm({ onSuccess }) {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Выберите вид...');
    const [enclosure, setEnclosure] = useState('Укажите вольер...');
    const [condition, setCondition] = useState('Укажите состояние...');
    const [status, setStatus] = useState('Укажите статус...');
    const [description, setDescription] = useState('');
    const [enclosuresList, setEnclosuresList] = useState([]);

    const fieldStyle = {
        width: "250px",
        boxSizing: "border-box",
        marginBottom: "5px"
    };

    useEffect(() => {
        let loadedEnclosures = [];
        const singleKeyData = localStorage.getItem('enclosures');
        if (singleKeyData) {
            const parsed = JSON.parse(singleKeyData);
            loadedEnclosures = parsed.map(enc => enc.name || enc.id);
        }

        loadedEnclosures.sort();
        setEnclosuresList(loadedEnclosures);
    }, []);

    const createNewAnimal = () => {
        let currentEmployeeId = localStorage.getItem('current_user_id') || '1';

        if (
            name.trim() === '' ||
            species.includes('Выберите') ||
            enclosure.includes('Укажите') ||
            condition.includes('Укажите') ||
            status.includes('Укажите') ||
            description.trim() === ''
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
        setSpecies('Выберите вид...');
        setEnclosure('Укажите вольер...');
        setCondition('Укажите состояние...');
        setStatus('Укажите статус...');

        if (onSuccess) onSuccess();
    };

    return (
        <div id="create-new-pet-form" style={{ margin: "10px 10px 10px 5px" }}>
            <h3>Введите данные нового питомца</h3>

            <input type="text" placeholder="Кличка" style={fieldStyle} value={name} onChange={e => setName(e.target.value)} /><br />

            <select style={fieldStyle} value={species} onChange={e => setSpecies(e.target.value)}>
                <option>Выберите вид...</option>
                <option value="Млекопитающее">Млекопитающее</option>
                <option value="Птица">Птица</option>
                <option value="Рептилия">Рептилия</option>
            </select><br />

            <select className="pet-selector" style={fieldStyle} value={enclosure} onChange={e => setEnclosure(e.target.value)}>
                <option>Укажите вольер...</option>
                {enclosuresList.map((encName, idx) => (
                    <option key={idx} value={encName}>{encName}</option>
                ))}
            </select><br />

            <select style={fieldStyle} value={condition} onChange={e => setCondition(e.target.value)}>
                <option>Укажите состояние...</option>
                <option value="Здоров">Здоров</option>
                <option value="Лечение">Лечение</option>
                <option value="Карантин">Карантин</option>
            </select><br />

            <select style={fieldStyle} value={status} onChange={e => setStatus(e.target.value)}>
                <option>Укажите статус...</option>
                <option value="Активен">Активен</option>
                <option value="Переведен">Переведен</option>
            </select><br />

            <textarea
                placeholder="Описание"
                style={{ ...fieldStyle, height: "60px", fontFamily: "inherit" }}
                value={description}
                onChange={e => setDescription(e.target.value)}
            /><br />

            <button onClick={createNewAnimal} style={{ margin: "5px 5px 5px 0" }}>
                Добавить питомца
            </button>
        </div>
    );
}

export function EditPetManager({ onPetsUpdated }) {
    const [searchId, setSearchId] = useState('');
    const [foundPet, setFoundPet] = useState(null);
    const [activeForm, setActiveForm] = useState('');

    const [newEnclosure, setNewEnclosure] = useState('Укажите вольер...');
    const [newCondition, setNewCondition] = useState('Укажите состояние...');
    const [newStatus, setNewStatus] = useState('Укажите статус...');
    const [enclosuresList, setEnclosuresList] = useState([]);

    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const singleKeyData = localStorage.getItem('enclosures');
        if (singleKeyData) {
            const parsed = JSON.parse(singleKeyData);
            const loadedEnclosures = parsed.map(enc => enc.name || enc.id);
            loadedEnclosures.sort();
            setEnclosuresList(loadedEnclosures);
        }
    }, []);

    const updatePetData = (updatedFields) => {
        const currentEmployeeId = localStorage.getItem('current_user_id') || '1';
        const now = new Date();
        const formattedDate = `${String(now.getDate()).padStart(2, '0')}.
        ${String(now.getMonth() + 1).padStart(2, '0')}.
        ${now.getFullYear()} 
        ${String(now.getHours()).padStart(2, '0')}:
        ${String(now.getMinutes()).padStart(2, '0')}`;

        const saved = localStorage.getItem('pets');
        if (saved) {
            const currentPets = JSON.parse(saved);

            const updatedPets = currentPets.map(pet => {
                if (String(pet.id) === String(foundPet.id)) {
                    const updated = {
                        ...pet,
                        ...updatedFields,
                        updateDate: formattedDate,
                        updateEmployee: currentEmployeeId
                    };
                    setFoundPet(updated);
                    return updated;
                }
                return pet;
            });

            localStorage.setItem('pets', JSON.stringify(updatedPets));
            alert('Данные успешно обновлены!');
            setActiveForm('');

            if (onPetsUpdated) onPetsUpdated();
        }
    };

    const handleFindById = () => {
        if (!searchId.trim()) return;

        const saved = localStorage.getItem('pets');
        if (saved) {
            const currentPets = JSON.parse(saved);
            const pet = currentPets.find(p => String(p.id) === searchId.trim());

            if (pet) {
                setFoundPet(pet);
                setActiveForm('');

                setNewEnclosure(pet.enclosure || 'Укажите вольер...');
                setNewCondition(pet.conditions || 'Укажите состояние...');
                setNewStatus(pet.status || 'Укажите статус...');
                setNewName(pet.name || '');
                setNewDescription(pet.description || '');
            } else {
                alert('Животного с таким ID не найдено!');
                setFoundPet(null);
            }
        } else {
            alert('База данных пуста!');
        }
    };

    const handleMoveToNewEnclosure = () => {
        if (newEnclosure.includes('Укажите')) {
            alert("Укажите новый вольер!");
            return;
        }
        updatePetData({ enclosure: newEnclosure });
    };

    const handleChangeCondition = () => {
        if (newCondition.includes('Укажите')) {
            alert("Выберите новое состояние!");
            return;
        }
        updatePetData({ conditions: newCondition });
    };

    const handleChangeStatus = () => {
        if (newStatus.includes('Укажите')) {
            alert("Укажите новый статус!");
            return;
        }
        updatePetData({ status: newStatus });
    };

    const handleChangeData = () => {
        if (newName.trim() === '' || newDescription.trim() === '') {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        if (newName.length > 50) {
            alert('Кличка слишком длинная!');
            return;
        }
        if (newDescription.length > 500) {
            alert('Описание слишком длинное!');
            return;
        }

        updatePetData({
            name: newName.trim(),
            description: newDescription.trim()
        });
    };

    const handleDeleteAnimal = () => {
        const saved = localStorage.getItem('pets');
        if (saved) {
            const currentPets = JSON.parse(saved);
            const filteredPets = currentPets.filter(pet => String(pet.id) !== String(foundPet.id));

            localStorage.setItem('pets', JSON.stringify(filteredPets));
            alert('Животное успешно удалено');

            setFoundPet(null);
            setSearchId('');
            setActiveForm('');

            if (onPetsUpdated) onPetsUpdated();
        }
    };

    return (
        <div id="find-pet-by-id-container" className="pet-container" style={{ margin: "10px 10px 10px 5px" }}>
            <label>Введите ID животного, чьи данные хотите отредактировать: <br />
                <input
                    type="text"
                    placeholder="ID животного"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    style={{ marginRight: '5px', padding: '4px' }}
                />
            </label>
            <button id="find-pet-by-id-btn" onClick={handleFindById}>
                Найти
            </button>

            {foundPet && (
                <>
                    <div style={{ marginTop: '15px' }}>
                        <SimplePetTable pets={[foundPet]} />
                    </div>

                    <div id="pet-edit-btns" className="pet-container" style={{ marginTop: '15px' }}>
                        <button className="pet-btn" onClick={() => setActiveForm(activeForm === 'enclosure' ? '' : 'enclosure')}>
                            Переместить в другой вольер
                        </button>
                        <button className="pet-btn" onClick={() => setActiveForm(activeForm === 'condition' ? '' : 'condition')}>
                            Изменить состояние
                        </button>
                        <button className="pet-btn" onClick={() => setActiveForm(activeForm === 'status' ? '' : 'status')}>
                            Смена статуса
                        </button>
                        <button className="pet-btn" onClick={() => setActiveForm(activeForm === 'data' ? '' : 'data')}>
                            Изменить данные
                        </button>
                        <button className="pet-btn" onClick={() => setActiveForm(activeForm === 'delete' ? '' : 'delete')}>
                            Удалить животное
                        </button>
                    </div>

                    {activeForm === 'enclosure' && (
                        <div id="pet-change-enclosure" className="pet-container" style={{ marginTop: '10px' }}>
                            <label>Выберите новый вольер <br/>
                                <select
                                    className="pet-selector"
                                    value={newEnclosure}
                                    onChange={e => setNewEnclosure(e.target.value)}
                                    style={{ width: "250px", marginBottom: "5px" }}
                                >
                                    <option>Укажите вольер...</option>
                                    {enclosuresList.map((encName, idx) => (
                                        <option key={idx} value={encName}>{encName}</option>
                                    ))}
                                </select> <br />
                                <button onClick={handleMoveToNewEnclosure}>Сохранить изменения</button>
                            </label>
                        </div>
                    )}

                    {activeForm === 'condition' && (
                        <div id="pet-change-condition" className="pet-container" style={{ marginTop: '10px' }}>
                            <label>Укажите новое состояние <br/>
                                <select
                                    className="pet-selector"
                                    value={newCondition}
                                    onChange={e => setNewCondition(e.target.value)}
                                    style={{ width: "250px", marginBottom: "5px" }}
                                >
                                    <option>Укажите состояние...</option>
                                    <option value="Здоров">Здоров</option>
                                    <option value="Лечение">Лечение</option>
                                    <option value="Карантин">Карантин</option>
                                </select> <br />
                                <button onClick={handleChangeCondition}>Сохранить изменения</button>
                            </label>
                        </div>
                    )}

                    {activeForm === 'status' && (
                        <div id="pet-change-status" className="pet-container" style={{ marginTop: '10px' }}>
                            <label>Укажите новый статус животного <br/>
                                <select
                                    className="pet-selector"
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                    style={{ width: "250px", marginBottom: "5px" }}
                                >
                                    <option>Укажите статус...</option>
                                    <option value="Активен">Активен</option>
                                    <option value="Переведен">Переведен</option>
                                </select> <br />
                                <button onClick={handleChangeStatus}>Сохранить изменения</button>
                            </label>
                        </div>
                    )}

                    {activeForm === 'data' && (
                        <div id="pet-change-data" className="pet-container" style={{ marginTop: '10px' }}>
                            <label> Укажите новое имя для животного <br/>
                                <input
                                    type="text"
                                    placeholder="Кличка"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    style={{ margin: "0 5px 5px 0", width: "250px", boxSizing: "border-box" }}
                                /> <br/>
                            </label>
                            <label> Введите новое описание животного <br/>
                                <textarea
                                    placeholder="Введите описание"
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    style={{ width: "250px", height: "60px", fontFamily: "inherit", boxSizing: "border-box", marginBottom: "5px" }}
                                ></textarea> <br />
                            </label>
                            <button onClick={handleChangeData}>Сохранить изменения</button>
                        </div>
                    )}

                    {activeForm === 'delete' && (
                        <div id="delete-pet" className="pet-container" style={{ margin: "10px 0" }}>
                            <label>Подтвердите удаление животного из базы данных <br/>
                                <button
                                    onClick={handleDeleteAnimal}
                                    style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', marginTop: '5px' }}
                                >
                                    Удалить окончательно
                                </button>
                            </label>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}