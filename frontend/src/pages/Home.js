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
    }

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
            </tr>
          </thead>
          <tbody>
            {gameChars.map((gameChar, index) => (
              <tr>
                <td>{gameChar.player}</td>
                <td>{gameChar.name}</td>
                <td>
                  <Link className='btn btn-primary mx-1' to={`/`}>Attributes</Link>
                  <Link className='btn btn-primary mx-1' to={`/`}>Abilities</Link>
                  <Link className='btn btn-primary mx-1' to={`/`}>Backgrounds</Link>
                  <Link className='btn btn-primary mx-1' to={`/`}>Bonus Points</Link>
                </td>
                <td>
                  <Link className='btn btn-primary mx-1' to={'/'}>Nova Points</Link>
                </td>
                <td>
                  <Link className='btn btn-primary mx-1' to={'/'}>View Character</Link>
                  <Link className='btn btn-primary mx-1' to={'/'}>Spend Experience</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
