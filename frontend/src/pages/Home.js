import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Home() {

    const [gameChars, setGameChars] = useState([]);

    useEffect(() => {
        loadGameChars();
    }, []);

    const loadGameChars = async () => {
        const result = await axios.get("http://localhost:8080/characters");
        console.log(result);
    }

  return (
    <div className="container">
      <h1>Welcome to the Character Creator</h1>
      <div>
        <Link to={'/basic-info-form'}>Create New Character</Link>
      </div>
      <div className="py-4">
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">Player Name</th>
              <th scope="col">Character Name</th>
              <th scope="col">Baseline Creation</th>
              <th scope="col">Nova Creation</th>
              <th scope="col">Character Advancement</th>
            </tr>
          </thead>
          <tbody>
            {gameChars.map((gameChar, index) => (
              <tr>
                <td>{gameChar.name}</td>
                <td>{gameChar.player}</td>
                <td>
                  <Link to={`/`}>Add Attributes</Link>
                  <Link to={`/`}>Add Abilities</Link>
                  <Link to={`/`}>Add Backgrounds</Link>
                  <Link to={`/`}>Spend Bonus Points</Link>
                </td>
                <td>
                  <Link to={'/'}>Spend Nova Points</Link>
                </td>
                <td>
                  <Link to={'/'}>View Character</Link>
                  <Link to={'/'}>Spend Experience Points</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
