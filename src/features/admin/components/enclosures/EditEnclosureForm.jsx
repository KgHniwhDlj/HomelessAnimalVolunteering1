import { useState } from 'react';

export default function EditEnclosureForm({ onEditSuccess }) {
  const [targetId, setTargetId] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const findEnclosureToEdit = () => {
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
      setIsFormVisible(false);
      return;
    }

    setName(enclosure.name);
    setSize(enclosure.size);
    setDate(enclosure.date);
    setAddress(enclosure.address);

    setIsFormVisible(true);
  };

  const saveEnclosureChanges = () => {
    if (!name.trim() || !size.trim() || !date.trim() || !address.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const savedData = localStorage.getItem('enclosures');
    if (!savedData) return;

    const currentEnclosures = JSON.parse(savedData);

    const updatedEnclosures = currentEnclosures.map((enc) => {
      if (String(enc.id) === targetId.trim()) {
        return {
          id: enc.id,
          name: name.trim(),
          size: size.trim(),
          date: date,
          address: address.trim(),
        };
      }
      return enc;
    });

    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));
    alert('Данные вольера успешно изменены!');

    setIsFormVisible(false);
    setTargetId('');

    if (onEditSuccess) onEditSuccess();
  };

  return (
    <div id="enclosure-editing" style={{ margin: '10px 10px 10px 5px' }}>
      <h3>Введите ID вольера, чьи данные хотите отредактировать</h3>
      <input
        type="text"
        placeholder="Введите ID"
        style={{ width: '150px', marginBottom: '10px', padding: '4px' }}
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
      />
      <button
        id="editing-enclosure-found-btn"
        onClick={findEnclosureToEdit}
        style={{ marginLeft: '5px' }}
      >
        Найти
      </button>

      {isFormVisible && (
        <div id="enclosure-editing-form" style={{ marginTop: '10px' }}>
          <input
            type="text"
            placeholder="ФИО"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Размер"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <br />
          <input
            type="date"
            placeholder="Дата"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <br />
          <button
            id="save-enclosure-changes-btn"
            onClick={saveEnclosureChanges}
            style={{ marginTop: '5px' }}
          >
            Сохранить изменения
          </button>
        </div>
      )}
    </div>
  );
}
