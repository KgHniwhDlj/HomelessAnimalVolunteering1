import { useState, useEffect } from 'react';
import SimpleEnclosureTable from './SimpleEnclosureTable';

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
