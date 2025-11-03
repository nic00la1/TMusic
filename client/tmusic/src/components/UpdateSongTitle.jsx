import React from 'react'

export const UpdateSongTitle = () => {
  // Stany komponentu
  const [songs, setSongs] = React.useState([]);
  const [selectedSongId, setSelectedSongId] = React.useState('');
  const [newTitle, setNewTitle] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');

  // Pobieranie piosenek przy montowaniu komponentu
  React.useEffect(() => {
    fetchSongs();
  }, []);

  // Funkcja do pobierania piosenek
  const fetchSongs = async () => {
    try {
      const response = await fetch('http://localhost:3001/songs');
      const data = await response.json();
      setSongs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setMessage('Błąd podczas pobierania piosenek');
      setLoading(false);
    }
  };

  // Obsługa wyboru piosenki
  const handleSongSelect = (e) => {
    const songId = e.target.value;
    setSelectedSongId(songId);
    
    // Znajdź wybraną piosenkę i ustaw jej aktualny tytuł
    const selectedSong = songs.find(song => song.ID.toString() === songId);
    if (selectedSong) {
      setNewTitle(selectedSong.title);
    }
  };

  // Obsługa zmiany tytułu
  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  // Obsługa wysyłki formularza
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSongId) {
      setMessage('Wybierz piosenkę do edycji!');
      return;
    }
    
    if (!newTitle.trim()) {
      setMessage('Podaj nowy tytuł piosenki!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/songs/${selectedSongId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim()
        })
      });

      if (response.ok) {
        setMessage('Tytuł piosenki został zaktualizowany pomyślnie!');
        // Odśwież listę piosenek
        fetchSongs();
        // Resetuj formularz
        setSelectedSongId('');
        setNewTitle('');
      } else {
        setMessage('Błąd podczas aktualizowania tytułu piosenki');
      }
    } catch (error) {
      console.error('Error updating song:', error);
      setMessage('Błąd podczas aktualizowania tytułu piosenki');
    }
  };

  if (loading) return <div className="loading">Ładowanie piosenek...</div>;

  return (
    <div>
      <h2>✏️ Edytuj Tytuł Piosenki</h2>
      
      {message && (
        <div className={`message ${message.includes('pomyślnie') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Wybierz piosenkę:</label>
          <select 
            value={selectedSongId}
            onChange={handleSongSelect}
          >
            <option value="">-- Wybierz piosenkę do edycji --</option>
            {songs.map(song => (
              <option key={song.ID} value={song.ID}>
                {song.title} - {song.author_name} {song.author_surname}
              </option>
            ))}
          </select>
        </div>
        
        {selectedSongId && (
          <div className="form-group">
            <label>Nowy tytuł piosenki:</label>
            <input 
              type="text" 
              value={newTitle}
              onChange={handleTitleChange}
              placeholder="Wprowadź nowy tytuł piosenki" 
            />
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!selectedSongId || !newTitle.trim()}
        >
          💾 Zapisz Zmiany
        </button>
      </form>
    </div>
  )
}
