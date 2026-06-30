import { useState } from 'react';

export default function CreateEnclosureForm({ onSuccess }) {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');

  const createNewEnclosure = () => {
    if (!name.trim() || !size.trim() || !date.trim() || !address.trim()) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const savedData = localStorage.getItem('enclosures');
    const currentEnclosures = savedData ? JSON.parse(savedData) : [];

    const enclosureID = Date.now();
    const newEnclosureData = {
      id: enclosureID,
      name: name.trim(),
      size: size.trim(),
      date: date.trim(),
      address: address.trim(),
    };

    const updatedEnclosures = [...currentEnclosures, newEnclosureData];
    localStorage.setItem('enclosures', JSON.stringify(updatedEnclosures));

    alert('Вольер успешно добавлен!');

    setName('');
    setSize('');
    setDate('');
    setAddress('');

    if (onSuccess) onSuccess();
  };

  return (
    <>
      <h3>Введите данные нового вольера</h3>
      <div
        id="enclosure-creation-form"
        style={{ margin: '10px 10px 10px 5px', display: 'flex', }}
      >
        <input
          type="text"
          maxLength={200}
          placeholder="Название"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={50}
          placeholder="Размер"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
        <br />
        <input
          type="date"
          maxLength={13}
          placeholder="Дата"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />
        <input
          type="text"
          maxLength={200}
          placeholder="Адрес"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <button
          id="submit-enclosure-btn"
          onClick={createNewEnclosure}
          style={{ margin: '5px 5px 5px 0' }}
        >
          Добавить вольер
        </button>
      </div>
    </>
  );
}



