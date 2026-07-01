import { useState, useEffect } from 'react';
import SimplePetTable from './components/SimplePetTable';
import { TextField } from '@mui/material';

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
            String(pet.enclosure) === query ||
            pet.status?.toLowerCase().includes(query)
        );
    });

    return (
      <div>
        <h3>Поиск питомцев</h3>
        <div style={{ marginBottom: '15px' }}>
          <TextField
            label="ID, кличка, вид, вольер или статус..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '5px',
            }}
            variant="standard"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ marginLeft: '5px' }}
            >
              Очистить
            </button>
          )}
        </div>
        <SimplePetTable pets={filteredPets} />
      </div>
    );
}
