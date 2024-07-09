import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import NavBar from './layout/NavBar';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddGameChar from './characters/AddGameChar';
import EditGameChar from './characters/EditGameChar';
import ViewGameChar from './characters/ViewGameChar';
import AddAttributes from './characters/AddAttributes';
import AddAbilities from './characters/AddAbilities';

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/addCharacter' element={<AddGameChar />} />
          <Route exact path='/editCharacter/:id' element={<EditGameChar />} />
          <Route exact path='/viewCharacter/:id' element={<ViewGameChar />} />
          <Route exact path='/addAttributes/:id' element={<AddAttributes />} />
          <Route exact path='/addAbilities/:id' element={<AddAbilities />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
