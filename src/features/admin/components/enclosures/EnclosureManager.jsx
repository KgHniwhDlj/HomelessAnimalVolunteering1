import { useState, useEffect } from 'react';
import SimpleEnclosureTable from './SimpleEnclosureTable';
import { Box, Button, TextField, Typography } from '@mui/material';

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
      <Box>
        <Typography variant="h6" gutterBottom>
          Поиск сотрудников
        </Typography>

        <Box sx={{ mb: '15px' }}>
          <TextField
            label="ID, название, размер или дата..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '5px',
            }}
            variant="standard"
          />
          {searchQuery && (
            <Button variant="contained" onClick={() => setSearchQuery('')}>
          Очистить
          </Button>
          )}

        </Box>
        <SimpleEnclosureTable enclosures={filteredEnclosures} />

      </Box>
    );
}
