import React from 'react'

export const NewSong = () => {

    // Form do dodawania nowej piosenki
    const [formData, setFormData] = React.useState({
        title: '',
        author: '',
        genre: '',
        score: 1,
        popularity: 1
    });

    // Stany do przechowywania autorów, gatunków, ładowania i wiadomości
    const [authors, setAuthors] = React.useState([]);
    const [genres, setGenres] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState('');

    // Pobieranie autorów i gatunków przy montowaniu komponentu
    React.useEffect(() => {
        fetchAuthors();
        fetchGenres();
    }, []);

    // Funkcja do pobierania autorów i gatunków
    const fetchAuthors = async () => {
        try {
            const response = await fetch('http://localhost:3001/authors');
            const data = await response.json();
            setAuthors(data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    // Funkcja do pobierania gatunków
    const fetchGenres = async () => {
        try {
            const response = await fetch('http://localhost:3001/genres');
            const data = await response.json();
            setGenres(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching genres:', error);
            setLoading(false);
        }
    };

    // Obsługa zmian w formularzu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Obsługa wysyłki formularza
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.author || !formData.genre) {
            setMessage('Wszystkie pola są wymagane!');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/songs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    ID_author: formData.author,
                    ID_genre: formData.genre,
                    Score: formData.score,
                    Popularity: formData.popularity
                })
            });

            if (response.ok) {
                setMessage('Piosenka została dodana pomyślnie!');
                setFormData({
                    title: '',
                    author: '',
                    genre: '',
                    score: 1,
                    popularity: 1
                });
            } else {
                setMessage('Błąd podczas dodawania piosenki');
            }
        } catch (error) {
            console.error('Error adding song:', error);
            setMessage('Błąd podczas dodawania piosenki');
        }
    };

    if (loading) return <div className="loading">Ładowanie...</div>;

    // Renderowanie formularza
  return (
    <div>
        <h2>🎤 Dodaj Nową Piosenkę</h2>
        
        {message && (
          <div className={`message ${message.includes('pomyślnie') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Tytuł piosenki:</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder='Wprowadź tytuł piosenki'
                />
            </div>
            
            <div className="form-group">
                <label>Autor:</label>
                <select 
                    name="author" 
                    value={formData.author}
                    onChange={handleInputChange}
                >
                    <option value="">-- Wybierz autora --</option>
                    {authors.map(author => (
                        <option key={author.ID} value={author.ID}>
                            {author.name} {author.surname}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label>Gatunek muzyczny:</label>
                <div className="radio-group">
                    {genres.map(genre => (
                        <div key={genre.ID} className="radio-item">
                            <input 
                                type="radio" 
                                id={`genre${genre.ID}`} 
                                name="genre" 
                                value={genre.ID}
                                checked={formData.genre === genre.ID.toString()}
                                onChange={handleInputChange}
                            />
                            <label htmlFor={`genre${genre.ID}`}>{genre.name}</label>
                        </div>
                    ))}
                </div>
            </div>
            
            <button type="submit">🎵 Dodaj Piosenkę</button>
        </form>
    </div>
  )
}
