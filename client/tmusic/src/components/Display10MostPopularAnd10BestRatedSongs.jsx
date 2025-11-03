import React, { useState, useEffect } from 'react'

export const Display10MostPopularAnd10BestRatedSongs = () => {
  const [popularSongs, setPopularSongs] = useState([]);
  const [bestRatedSongs, setBestRatedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch most popular songs
        const popularResponse = await fetch('http://localhost:3001/songs/top10/popularity');
        const popularData = await popularResponse.json();
        setPopularSongs(popularData);

        // Fetch best rated songs
        const ratedResponse = await fetch('http://localhost:3001/songs/top10/score');
        const ratedData = await ratedResponse.json();
        setBestRatedSongs(ratedData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>10 Najpopularniejszych i 10 Najlepiej Ocenianych Piosenek</h2>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Most Popular Songs Table */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <h3>10 Najpopularniejszych Piosenek</h3>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: '1px solid #ddd',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Author</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Popularity</th>
              </tr>
            </thead>
            <tbody>
              {popularSongs.map((song, index) => (
                <tr key={song.ID} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.author_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.Popularity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best Rated Songs Table */}
        <div style={{ flex: '1', minWidth: '400px' }}>
          <h3>10 Najlepiej Ocenianych Piosenek</h3>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: '1px solid #ddd',
            backgroundColor: 'white'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Title</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Author</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {bestRatedSongs.map((song, index) => (
                <tr key={song.ID} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.author_name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{song.Score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
