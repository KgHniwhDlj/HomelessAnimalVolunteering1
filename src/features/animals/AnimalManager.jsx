import { useState, useEffect } from 'react';
import SimplePetTable from './components/SimplePetTable';
import { Box, Button, TextField, Typography } from '@mui/material';

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
      <Box>
        <Typography variant="h6" gutterBottom>
          Поиск питомцев
        </Typography>
        <Box sx={{ mb: '15px' }}>
          <TextField
            label="ID, кличка, вид, вольер или статус..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              p: '5px',
            }}
            variant="standard"
          />
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery('')}
              sx={{ ml: '5px', backgroundColor: '#3e332e', color: '#ffdfdf' }}
            >
              Очистить
            </Button>
          )}
        </Box>
        <SimplePetTable pets={filteredPets} />
      </Box>
    );
}
