import SimpleEnclosureTable from './SimpleEnclosureTable';
import { useState } from 'react';

export default function DeleteEnclosureForm({ onDeleteSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [foundEnclosure, setFoundEnclosure] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  const findEnclosureToDelete = () => {
    if (!targetId.trim()) {
      alert('Пожалуйста, введите ID вольера!');
      return;
    }

    const savedData = localStorage.getItem('enclosures');
    const currentEnclosures = savedData ? JSON.parse(savedData) : [];
    const enclosure = currentEnclosures.find(
      (enc) => String(enc.id) === targetId.trim(),
    );

    if (!enclosure) {
      alert('Вольер с таким ID не найден!');
      setIsInfoVisible(false);
      setFoundEnclosure(null);
      return;
    }

    setFoundEnclosure(enclosure);
    setIsInfoVisible(true);
  };

  const confirmEnclosureDeletion = () => {
    const savedData = localStorage.getItem('enclosures');
    if (!savedData) return;

    const currentEnclosures = JSON.parse(savedData);
    const updatedEnclosures = currentEnclosures.filter(
      (enc) => String(enc.id) !== targetId.trim(),
    );

    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));
    alert('Вольер успешно удален!');

    setIsInfoVisible(false);
    setFoundEnclosure(null);
    setTargetId('');

    if (onDeleteSuccess) onDeleteSuccess();
  };

  return (
    <div id="enclosure-deletion">
      <h3>Введите ID вольера для его удаления</h3>
      <input
        type="text"
        style={{ margin: '2px 2px 2px 5px' }}
        placeholder="ID вольера"
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
      />
      <button id="deletion-enclosure-found-btn" onClick={findEnclosureToDelete}>
        Найти
      </button>

      {isInfoVisible && foundEnclosure && (
        <div className="enclosure-container-info" id="enclosure-deletion-info">
          <SimpleEnclosureTable enclosures={[foundEnclosure]} />

          <button
            id="deletion-enclosure-btn"
            onClick={confirmEnclosureDeletion}
            style={{ marginTop: '10px' }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
