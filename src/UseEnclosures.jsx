import { useState, useEffect } from 'react';

export function useEnclosures() {
  const [enclosuresList, setEnclosuresList] = useState([]);

  useEffect(() => {
    const singleKeyData = localStorage.getItem('enclosures');
    if (singleKeyData) {
      const parsed = JSON.parse(singleKeyData);

      const loadedEnclosures = parsed.map((enc) => ({
        id: enc.id,
        name: enc.name,
      }));

      loadedEnclosures.sort((a, b) => a.name.localeCompare(b.name));
      setEnclosuresList(loadedEnclosures);
    }
  }, []);

  return enclosuresList;
}
