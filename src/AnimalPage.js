import { useState, useEffect } from 'react';
import { toggleTables } from "./AdminPage";
import PetManager, { CreatePetForm, SimplePetTable, EditPetManager } from "./AnimalManager";

export default function AnimalTable({ onLogout }) {
    const [isCreateAnimal, setIsCreateAnimal] = useState(false);
    const [isFindAnimal, setIsFindAnimal] = useState(false);
    const [isEditAnimal, setIsEditAnimal] = useState(false);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        refreshPets();
    }, []);

    const refreshPets = () => {
        const saved = localStorage.getItem('pets');
        setPets(saved ? JSON.parse(saved) : []);
    };

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: "0 10px 0 5px" }}>
                <h1>Список животных</h1>
                <button className="pet-btn" onClick={onLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', cursor: 'pointer' }}>
                    Выйти из системы
                </button>
            </div>

            <div className="vertical-buttons" style={{ margin: "10px 10px 10px 5px" }}>
                <button id="create-pet-btn" className="pet-btn" type="button" onClick={() => toggleTables(setIsCreateAnimal)}>
                    Зарегистрировать животное
                </button>
                <button id="find-pet-container-btn" className="pet-btn" onClick={() => toggleTables(setIsFindAnimal)}>
                    Найти животное
                </button>
                <button id="edit-pet-btn" className="pet-btn" onClick={() => toggleTables(setIsEditAnimal)}>
                    Редактировать данные
                </button>
            </div>

            {isCreateAnimal && <CreatePetForm onSuccess={() => { setIsCreateAnimal(false); refreshPets(); }} />}
            {isFindAnimal && <PetManager />}
            {isEditAnimal && <EditPetManager onPetsUpdated={refreshPets} />}

            <SimplePetTable pets={pets} />
        </>
    );
}