import { useState, useEffect } from 'react';
import { toggleTables } from "./AdminPage";
import EditPetManager from '../features/animals/components/EditPetManager';
import {Box} from "@mui/material";
import CreatePetForm from '../features/animals/components/CreatePetForm';
import PetManager from '../features/animals/AnimalManager';
import SimplePetTable from '../features/animals/components/SimplePetTable';

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
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '0 10px 0 5px',
          }}
        >
          <h1>Список животных</h1>
          <button className="exit-btn" onClick={onLogout}>
            Выйти из системы
          </button>
        </header>

        <div
          className="vertical-buttons"
          style={{ margin: '10px 10px 10px 5px' }}
        >
          <button
            id="create-pet-btn"
            className="pet-btn"
            type="button"
            onClick={() => toggleTables(setIsCreateAnimal)}
          >
            Зарегистрировать животное
          </button>
          {isCreateAnimal && (
            <CreatePetForm
              onSuccess={() => {
                setIsCreateAnimal(false);
                refreshPets();
              }}
            />
          )}
          <button
            id="find-pet-container-btn"
            className="pet-btn"
            onClick={() => toggleTables(setIsFindAnimal)}
          >
            Найти животное
          </button>
          {isFindAnimal && <PetManager />}
          <button
            id="edit-pet-btn"
            className="pet-btn"
            onClick={() => toggleTables(setIsEditAnimal)}
          >
            Редактировать данные
          </button>
          {isEditAnimal && <EditPetManager onPetsUpdated={refreshPets} />}
        </div>
            <SimplePetTable pets={pets} />
      </>
    );
}