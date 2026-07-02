import { useState, useEffect } from 'react';
import { toggleTables } from "./AdminPage";
import EditPetManager from '../features/animals/components/EditPetManager';
import { Box, Button, Typography } from '@mui/material';
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
          <Typography variant="h2" gutterBottom>
            Список животных
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, backgroundColor: '#ffdfdf', color: '#3e332e' }}
            onClick={onLogout}
          >
            Выйти из системы
          </Button>
        </header>

        <Box
          sx={{
            m: '10px 10px 10px 5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
            onClick={() => toggleTables(setIsCreateAnimal)}
          >
            Зарегистрировать животное
          </Button>
          {isCreateAnimal && (
            <CreatePetForm
              onSuccess={() => {
                setIsCreateAnimal(false);
                refreshPets();
              }}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
            onClick={() => toggleTables(setIsFindAnimal)}
          >
            Найти животное
          </Button>
          {isFindAnimal && <PetManager />}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1, backgroundColor: '#3e332e', color: '#ffdfdf' }}
            onClick={() => toggleTables(setIsEditAnimal)}
          >
            Редактировать данные
          </Button>
          {isEditAnimal && <EditPetManager onPetsUpdated={refreshPets} />}
        </Box>
        <SimplePetTable pets={pets} />
      </>
    );
}