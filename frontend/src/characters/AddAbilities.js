import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function AddAbilities() {

  let navigate = useNavigate();

  const [abilities, setAbilities] = useState([]);
  const [gameChar, setGameChar] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    loadAbilities();
  }, []);

  useEffect(() => {
      loadGameChar();
  }, []);

  const loadAbilities = async () => {
    const result = await axios.get(`http://localhost:8080/abilities/${id}`);
    setAbilities(result.data);
  };

  const loadGameChar = async () => {
      const result = await axios.get(`http://localhost:8080/character/${id}`);
      setGameChar(result.data);
  };

  const categorizedAbilities = abilities.reduce((acc, ability, index) => {
    const { associatedAttribute, name } = ability;
    if (!acc[associatedAttribute]) {
      acc[associatedAttribute] = [];
    }
    acc[associatedAttribute].push({ ...ability, index });
    return acc;
  }, {});

  const handleAbilityChange = (index, newValue) => {
    const newAbilities = [...abilities];
    newAbilities[index].value = newValue;
    setAbilities(newAbilities);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/allocateAbilityPoints/${id}`, { abilities });
      console.log('Update successful: ', response.data);
      alert("Abilities successfully updated");
      navigate('/');
    } catch (error) {
      console.error('Error updating abilities: ', error);
    }
  };

  return (
    <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
      <h1 className="text-center my-4">{gameChar.novaName}'s Abilities</h1>
      <form onSubmit={handleSubmit} className='px-5'>
        {Object.keys(categorizedAbilities).map(attribute => (
          <div key={attribute} className="mb-4">
            <h3>{attribute}</h3>
            <ul className="list-group">
              {categorizedAbilities[attribute].map(({ name, value, index }) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{name}</span>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    className="form-control w-25"
                    value={value}
                    onChange={(e) => handleAbilityChange(index, parseInt(e.target.value, 10))}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button className='btn btn-outline-primary' onClick={handleSubmit}>Save Abilities</button>
        <Link className='btn btn-outline-danger mx-2' to='/'>Cancel</Link>
      </form>
    </div>
  );
}
