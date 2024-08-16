import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {

  const [gameChars, setGameChars] = useState([]);

  useEffect(() => {
    loadGameChars();
  }, []);

  const loadGameChars = async () => {
    const result = await axios.get("http://localhost:8080/characters");
    setGameChars(result.data);
  };

  const deleteGameChar = async (id) => {
    await axios.delete(`http://localhost:8080/character/${id}`);
    loadGameChars();
  };

  return (
    <div className="container">
      <h1>Welcome to the Character Creator</h1>
      <div className="py-4">
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">Player Name</th>
              <th scope="col">Character Name</th>
              <th scope="col">Baseline Creation</th>
              <th scope="col">Nova Creation</th>
              <th scope="col">Character Advancement</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {gameChars.map((gameChar, index) => (
              <tr>
                <td>{gameChar.player}</td>
                <td>
                  <Link to={`/editCharacter/${gameChar.id}`}>{gameChar.name}</Link>
                </td>
                <td>
                  <Link className='btn btn-primary mx-1' to={`/addAttributes/${gameChar.id}`}>Attributes</Link>
                  <Link className='btn btn-primary mx-1' to={`/addAbilities/${gameChar.id}`}>Abilities</Link>
                  <Link className='btn btn-primary mx-1' to={`/addBackgrounds/${gameChar.id}`}>Backgrounds</Link>
                  <Link className='btn btn-primary mx-1' to={`/spendBonusPoints/${gameChar.id}`}>Bonus Points</Link>
                </td>
                <td>
                  <Link className='btn btn-primary mx-1' to={`/spendNovaPoints/${gameChar.id}`}>Nova Points</Link>
                </td>
                <td>
                  <Link className='btn btn-primary mx-1' to={`/viewCharacter/${gameChar.id}`}>View Character</Link>
                  <Link className='btn btn-primary mx-1' to={`/spendExperiencePoints/${gameChar.id}`}>Spend Experience</Link>
                </td>
                <td>
                  <button className='btn btn-danger mx-1' onClick={() => deleteGameChar(gameChar.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
