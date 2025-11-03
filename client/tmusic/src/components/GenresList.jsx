import { useState, useEffect } from 'react';

function GenresList() {
  const [genres, setGenres] = useState([]); // Lista gatunków
  const [loading, setLoading] = useState(true); // Stan ładowania
  const [error, setError] = useState(null); // Stan błędu

  // Pobieranie gatunków z serwera
  useEffect(() => {
    fetchGenres();
  }, []);

  // Funkcja do pobierania gatunków
  const fetchGenres = async () => {
    try {
      const response = await fetch('http://localhost:3001/genres');
      if (!response.ok) {
        throw new Error('Nie udało się pobrać gatunków z serwera.');
      }
      const data = await response.json(); // Oczekujemy, że dane będą w formacie JSON
      setGenres(data); 
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Ładowanie gatunków...</div>;
  if (error) return <div className="error">Błąd: {error}</div>;

  return (
    <div>
      <h2>🎵 Gatunki Muzyczne</h2>
      <ul>
        {genres.map((genre) => (
          <li key={genre.ID}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default GenresList;
