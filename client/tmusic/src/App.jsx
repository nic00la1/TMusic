import './App.css'
import GenresList from './components/GenresList'
import { NewSong } from './components/NewSong'
import { UpdateSongTitle } from './components/UpdateSongTitle'
import { Display10MostPopularAnd10BestRatedSongs } from './components/Display10MostPopularAnd10BestRatedSongs'

function App() {

  return (
    <>
      <div className="app-container">
        <h1>TMusic - Zarządzanie Muzyką</h1>
        
        <div className="section">
          <GenresList />
        </div>
        
        <div className="section">
          <NewSong />
        </div>
        
        <div className="section">
          <UpdateSongTitle />
        </div>
        
        <div className="section">
          <Display10MostPopularAnd10BestRatedSongs />
        </div>
      </div>
    </>
  )
}

export default App
